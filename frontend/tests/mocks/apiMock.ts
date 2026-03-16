import type { Page, Route, Request } from '@playwright/test';

type Json = Record<string, any> | any[];

function json(route: Route, status: number, body: Json) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

/* ─── Sample data ──────────────────────────────────────────── */

const MOCK_USER = {
  id: 'test-user',
  first_name: 'Test',
  last_name: 'User',
  phone: '07123456789',
  email: 'test@example.com',
  middle_names: '',
  trusted_contacts: [],
};

const MOCK_RIDE = {
  id: 'ride-1',
  driver_id: 'driver-1',
  driver_name: 'Alice Driver',
  origin: 'University of Bath',
  destination: 'Bath Spa Station',
  origin_lat: 51.3796,
  origin_lng: -2.3279,
  destination_lat: 51.3776,
  destination_lng: -2.3569,
  departure_time: new Date(Date.now() + 3_600_000).toISOString(),
  arrival_time: new Date(Date.now() + 5_400_000).toISOString(),
  seats_available: 3,
  price: 5.0,
  status: 'upcoming',
};

const MOCK_PAST_RIDE = {
  ...MOCK_RIDE,
  id: 'ride-2',
  status: 'completed',
  departure_time: new Date(Date.now() - 86_400_000).toISOString(),
  arrival_time: new Date(Date.now() - 82_800_000).toISOString(),
};

const MOCK_BOOKING = {
  id: 'booking-1',
  ride_id: 'ride-1',
  passenger_id: 'test-user',
  status: 'confirmed',
  pickup_lat: 51.3796,
  pickup_lng: -2.3279,
};

const MOCK_NOTIFICATION = {
  id: 'notif-1',
  type: 'ride',
  title: 'Ride confirmed',
  body: 'Your ride to Bath Spa Station has been confirmed.',
  link: '/activity',
  read: false,
  created_at: new Date().toISOString(),
};

/* ─── Mock installer ───────────────────────────────────────── */

export async function installApiMocks(page: Page) {
  await page.route('**/*', async (route: Route) => {
    const req: Request = route.request();
    const url = req.url();
    const method = req.method();
    const resourceType = req.resourceType();

    // Let static assets through
    if (resourceType !== 'xhr' && resourceType !== 'fetch') {
      return route.continue();
    }

    // ── Health ──
    if (url.match(/\/health$/) && method === 'GET') {
      return json(route, 200, { status: 'ok' });
    }

    // ── Auth ──
    if (url.match(/\/auth\/login$/) && method === 'POST') {
      return json(route, 200, { access_token: 'test-token' });
    }
    if (url.match(/\/auth\/register$/) && method === 'POST') {
      return json(route, 200, { message: 'Account created' });
    }
    if (url.match(/\/auth\/logout$/) && method === 'POST') {
      return json(route, 200, { message: 'Logged out' });
    }

    // ── Users ──
    if (url.match(/\/users\/me$/) && method === 'GET') {
      return json(route, 200, MOCK_USER);
    }
    if (url.match(/\/users\/me\/preferences$/) && method === 'PUT') {
      const body = req.postDataJSON?.() ?? {};
      return json(route, 200, {
        ...MOCK_USER,
        trusted_contacts: body.trusted_contacts ?? [],
      });
    }

    // ── Drivers ──
    if (url.match(/\/drivers\/me\/status$/) && method === 'GET') {
      return json(route, 200, { is_driver: true, status: 'approved' });
    }
    if (url.match(/\/drivers\/me$/) && method === 'GET') {
      return json(route, 200, {
        id: 'test-user',
        vehicle_make: 'Toyota',
        vehicle_model: 'Corolla',
        vehicle_colour: 'Blue',
        vehicle_registration: 'AB12 CDE',
        license_number: 'DRIVE123',
      });
    }
    if (url.match(/\/drivers\/validate$/) && method === 'POST') {
      return json(route, 200, { valid: true, field_errors: {} });
    }
    if (url.match(/\/drivers\/upgrade$/) && method === 'POST') {
      return json(route, 200, { status: 'pending' });
    }

    // ── Rides ──
    if (url.match(/\/rides\/active$/) && method === 'GET') {
      return json(route, 200, []);
    }
    if (url.match(/\/rides\/driver\/active$/) && method === 'GET') {
      return json(route, 200, []);
    }
    if (url.match(/\/rides\/search/) && method === 'GET') {
      return json(route, 200, [MOCK_RIDE]);
    }
    if (url.match(/\/rides\/?$/) && method === 'GET') {
      return json(route, 200, [MOCK_RIDE, MOCK_PAST_RIDE]);
    }
    if (url.match(/\/rides\/?$/) && method === 'POST') {
      return json(route, 201, { ...MOCK_RIDE, id: 'new-ride' });
    }

    // ── Bookings ──
    if (url.match(/\/bookings\/me$/) && method === 'GET') {
      return json(route, 200, [MOCK_BOOKING]);
    }
    if (url.match(/\/bookings\/driver\/me$/) && method === 'GET') {
      return json(route, 200, []);
    }
    if (url.match(/\/bookings\/?/) && method === 'POST') {
      return json(route, 201, MOCK_BOOKING);
    }

    // ── Ratings ──
    if (url.match(/\/ratings\//) && method === 'GET') {
      return json(route, 200, { ride_id: 'ride-2', rating: 4.5, rated_by: 'test-user' });
    }
    if (url.match(/\/ratings\/?/) && method === 'POST') {
      return json(route, 201, { ride_id: 'ride-2', rating: 5, rated_by: 'test-user' });
    }

    // ── Notifications ──
    if (url.match(/\/notifications\/unread-count$/) && method === 'GET') {
      return json(route, 200, { unread_count: 1 });
    }
    if (url.match(/\/notifications\/read-all$/) && method === 'PUT') {
      return json(route, 200, { success: true });
    }
    if (url.match(/\/notifications\/read-by-link/) && method === 'PUT') {
      return json(route, 200, { success: true });
    }
    if (url.match(/\/notifications\/?$/) && method === 'GET') {
      return json(route, 200, [MOCK_NOTIFICATION]);
    }
    if (url.match(/\/notification/) && method === 'GET') {
      return json(route, 200, [MOCK_NOTIFICATION]);
    }

    // ── Incidents ──
    if (url.match(/\/incidents/) && method === 'POST') {
      return json(route, 201, { id: 'inc-1', status: 'submitted' });
    }

    // ── Timetable ──
    if (url.match(/\/timetable/) && method === 'POST') {
      return json(route, 200, [
        {
          summary: 'CM10228 Lecture',
          location: '1 West 2.101',
          start: new Date(Date.now() + 7_200_000).toISOString(),
          end: new Date(Date.now() + 10_800_000).toISOString(),
        },
      ]);
    }

    // ── Routing / Geocode ──
    if (url.includes('/routing/')) {
      return json(route, 200, { distance: 4200, duration: 720, geometry: [] });
    }

    // ── Chat ──
    if (url.match(/\/chat\//) && method === 'GET') {
      return json(route, 200, []);
    }

    // ── Catch-all for known API prefixes ──
    if (
      url.includes('/auth/') ||
      url.includes('/drivers/') ||
      url.includes('/users/') ||
      url.includes('/rides/') ||
      url.includes('/bookings/') ||
      url.includes('/ratings/') ||
      url.includes('/notifications/') ||
      url.includes('/notification') ||
      url.includes('/incidents') ||
      url.includes('/timetable') ||
      url.includes('/chat/')
    ) {
      return json(route, 200, {});
    }

    return route.continue();
  });
}
