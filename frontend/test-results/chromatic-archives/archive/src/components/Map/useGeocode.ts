import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=b8f2434d"; const useState = __vite__cjsImport0_react["useState"];
import { apiFetch } from "/src/lib/api.ts";
export const useGeocode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const geocodeAddress = async (address) => {
    if (!address.trim()) return [];
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(
        `/routing/geocode?q=${encodeURIComponent(address)}`,
        { method: "GET" }
      );
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("Error during geocoding:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to geocode address");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { geocodeAddress, loading, error };
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVzZUdlb2NvZGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGFwaUZldGNoIH0gZnJvbSAnLi4vLi4vbGliL2FwaSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEdlb2NvZGVSZXN1bHQge1xyXG4gIGxhYmVsOiBzdHJpbmc7XHJcbiAgbGF0OiBudW1iZXI7XHJcbiAgbG5nOiBudW1iZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIb29rIHRvIGNhbGwgdGhlIGJhY2tlbmQgZ2VvY29kaW5nIGVuZHBvaW50LlxyXG4gKiBCYWNrZW5kIHJvdXRlOiBHRVQgL3JvdXRpbmcvZ2VvY29kZT9xPS4uLlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHVzZUdlb2NvZGUgPSAoKSA9PiB7XHJcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XHJcblxyXG4gIGNvbnN0IGdlb2NvZGVBZGRyZXNzID0gYXN5bmMgKGFkZHJlc3M6IHN0cmluZyk6IFByb21pc2U8R2VvY29kZVJlc3VsdFtdPiA9PiB7XHJcbiAgICBpZiAoIWFkZHJlc3MudHJpbSgpKSByZXR1cm4gW107XHJcblxyXG4gICAgc2V0TG9hZGluZyh0cnVlKTtcclxuICAgIHNldEVycm9yKG51bGwpO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBhcGlGZXRjaDxHZW9jb2RlUmVzdWx0W10+KFxyXG4gICAgICAgIGAvcm91dGluZy9nZW9jb2RlP3E9JHtlbmNvZGVVUklDb21wb25lbnQoYWRkcmVzcyl9YCxcclxuICAgICAgICB7IG1ldGhvZDogJ0dFVCcgfVxyXG4gICAgICApO1xyXG4gICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEgOiBbXTtcclxuICAgIH0gY2F0Y2ggKGVycjogdW5rbm93bikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkdXJpbmcgZ2VvY29kaW5nOicsIGVycik7XHJcbiAgICAgIGNvbnN0IG1zZyA9IGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBTdHJpbmcoZXJyKTtcclxuICAgICAgc2V0RXJyb3IobXNnIHx8ICdGYWlsZWQgdG8gZ2VvY29kZSBhZGRyZXNzJyk7XHJcbiAgICAgIHRocm93IGVycjtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiB7IGdlb2NvZGVBZGRyZXNzLCBsb2FkaW5nLCBlcnJvciB9O1xyXG59O1xyXG4iXSwibWFwcGluZ3MiOiJBQUFBLFNBQVMsZ0JBQWdCO0FBQ3pCLFNBQVMsZ0JBQWdCO0FBWWxCLGFBQU0sYUFBYSxNQUFNO0FBQzlCLFFBQU0sQ0FBQyxTQUFTLFVBQVUsSUFBSSxTQUFTLEtBQUs7QUFDNUMsUUFBTSxDQUFDLE9BQU8sUUFBUSxJQUFJLFNBQXdCLElBQUk7QUFFdEQsUUFBTSxpQkFBaUIsT0FBTyxZQUE4QztBQUMxRSxRQUFJLENBQUMsUUFBUSxLQUFLLEVBQUcsUUFBTyxDQUFDO0FBRTdCLGVBQVcsSUFBSTtBQUNmLGFBQVMsSUFBSTtBQUViLFFBQUk7QUFDRixZQUFNLE9BQU8sTUFBTTtBQUFBLFFBQ2pCLHNCQUFzQixtQkFBbUIsT0FBTyxDQUFDO0FBQUEsUUFDakQsRUFBRSxRQUFRLE1BQU07QUFBQSxNQUNsQjtBQUNBLGFBQU8sTUFBTSxRQUFRLElBQUksSUFBSSxPQUFPLENBQUM7QUFBQSxJQUN2QyxTQUFTLEtBQWM7QUFDckIsY0FBUSxNQUFNLDJCQUEyQixHQUFHO0FBQzVDLFlBQU0sTUFBTSxlQUFlLFFBQVEsSUFBSSxVQUFVLE9BQU8sR0FBRztBQUMzRCxlQUFTLE9BQU8sMkJBQTJCO0FBQzNDLFlBQU07QUFBQSxJQUNSLFVBQUU7QUFDQSxpQkFBVyxLQUFLO0FBQUEsSUFDbEI7QUFBQSxFQUNGO0FBRUEsU0FBTyxFQUFFLGdCQUFnQixTQUFTLE1BQU07QUFDMUM7IiwibmFtZXMiOltdfQ==