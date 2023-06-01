export default function useLog() {
  function log(prefix?: string, message?: any) {
    console.log(`[${prefix}]`, message);
  }
  return { log };
}
