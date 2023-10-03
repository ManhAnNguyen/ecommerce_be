function removePropertiesEmpty<T>(obj: Record<string, unknown>) {
  return Object.entries(obj).reduce(
    (result, [key, value]) => (!!value ? { ...result, [key]: value } : result),
    {}
  );
}

export { removePropertiesEmpty };
