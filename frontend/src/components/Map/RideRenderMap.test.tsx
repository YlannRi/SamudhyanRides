import { act, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from '../../lib/api';
import { RideRenderMap } from './RideRenderMap';

const mapMocks = vi.hoisted(() => ({
  clickHandler: undefined as ((event: { latlng: { lat: number; lng: number } }) => void) | undefined,
  fitBounds: vi.fn(),
  geoJSON: vi.fn((data: unknown) => ({
    getBounds: () => ({ source: data }),
  })),
  mapContainerProps: [] as any[],
  mergeOptions: vi.fn(),
}));

vi.mock('../../lib/api', () => ({
  apiFetch: vi.fn(),
}));

vi.mock('leaflet', () => ({
  default: {
    Icon: {
      Default: {
        mergeOptions: mapMocks.mergeOptions,
      },
    },
    geoJSON: mapMocks.geoJSON,
  },
}));

vi.mock('react-leaflet', () => ({
  GeoJSON: ({ data }: { data: unknown }) => <div data-testid="geojson">{JSON.stringify(data)}</div>,
  MapContainer: ({ children, ...props }: any) => {
    mapMocks.mapContainerProps.push(props);
    return <div data-testid="map-container">{children}</div>;
  },
  Marker: ({ position }: { position: unknown }) => <div data-testid="marker">{JSON.stringify(position)}</div>,
  TileLayer: ({ url }: { url: string }) => <div data-testid="tile-layer">{url}</div>,
  useMapEvents: (events: Record<string, unknown> = {}) => {
    if (typeof events.click === 'function') {
      mapMocks.clickHandler = events.click as (event: { latlng: { lat: number; lng: number } }) => void;
    }

    return { fitBounds: mapMocks.fitBounds };
  },
}));

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

describe('RideRenderMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mapMocks.clickHandler = undefined;
    mapMocks.mapContainerProps.length = 0;
  });

  it('shows a loading state while the route request is pending', async () => {
    const request = deferred<any>();
    vi.mocked(apiFetch).mockReturnValueOnce(request.promise);

    render(<RideRenderMap rideId={123} />);

    expect(screen.getByText('Loading map route...')).toBeInTheDocument();
    expect(apiFetch).toHaveBeenCalledWith('/routing/ride/123', { method: 'GET' });

    request.resolve({ route: { features: [] }, times: { pickups: [] } });

    await waitFor(() => {
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
  });

  it('renders route data, fits bounds, filters confirmed pickup markers, and allows pickup selection', async () => {
    const onRouteData = vi.fn();
    const onPickupSelect = vi.fn();
    vi.mocked(apiFetch).mockResolvedValueOnce({
      route: {
        type: 'FeatureCollection',
        features: [{ type: 'Feature' }],
      },
      times: {
        pickups: [
          { lat: 51.401, lng: -2.401, booking_ids: [1] },
          { lat: 51.402, lng: -2.402, booking_ids: [2, 3] },
        ],
      },
    });

    render(
      <RideRenderMap
        rideId={123}
        driverMode={true}
        confirmedPickupIds={[2, 3]}
        existingPickup={{ lat: 51.39, lng: -2.39 }}
        onPickupSelect={onPickupSelect}
        onRouteData={onRouteData}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    expect(onRouteData).toHaveBeenCalledWith(
      expect.objectContaining({
        route: expect.any(Object),
        times: expect.any(Object),
      }),
    );
    expect(mapMocks.fitBounds).toHaveBeenCalled();
    expect(screen.getAllByTestId('marker')).toHaveLength(2);
    expect(screen.getByText('[51.39,-2.39]')).toBeInTheDocument();
    expect(screen.getByText('[51.401,-2.401]')).toBeInTheDocument();

    await act(async () => {
      mapMocks.clickHandler?.({ latlng: { lat: 51.403, lng: -2.403 } });
    });

    expect(onPickupSelect).toHaveBeenCalledWith(51.403, -2.403);
    await waitFor(() => {
      expect(screen.getAllByTestId('marker')).toHaveLength(3);
    });
    expect(screen.getByText('{"lat":51.403,"lng":-2.403}')).toBeInTheDocument();
  });

  it('renders raw geojson fallback data and hides driver pickup markers in user mode', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({
      type: 'FeatureCollection',
      features: [{ type: 'Feature' }],
    });

    render(<RideRenderMap rideId={456} driverMode={false} />);

    await waitFor(() => {
      expect(screen.getByTestId('geojson')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('marker')).not.toBeInTheDocument();
    expect(mapMocks.fitBounds).toHaveBeenCalled();
  });

  it('shows an error state when route loading fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('Routing down'));

    render(<RideRenderMap rideId={789} />);

    await waitFor(() => {
      expect(screen.getByText('Routing down')).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching map route:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('logs bounds failures without crashing the map render', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mapMocks.geoJSON.mockImplementationOnce(() => {
      throw new Error('Bounds failure');
    });
    vi.mocked(apiFetch).mockResolvedValueOnce({
      route: {
        type: 'FeatureCollection',
        features: [{ type: 'Feature' }],
      },
    });

    render(<RideRenderMap rideId={222} />);

    await waitFor(() => {
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error computing bounds:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('disables click interaction when the map is not interactive', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({
      route: {
        type: 'FeatureCollection',
        features: [{ type: 'Feature' }],
      },
      times: {
        pickups: [{ lat: 51.5, lng: -2.5, booking_ids: [5] }],
      },
    });

    render(<RideRenderMap rideId={333} interactive={false} onPickupSelect={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    expect(mapMocks.clickHandler).toBeUndefined();
    expect(mapMocks.mapContainerProps[0]).toEqual(
      expect.objectContaining({
        scrollWheelZoom: false,
        dragging: false,
        zoomControl: false,
      }),
    );
  });
});
