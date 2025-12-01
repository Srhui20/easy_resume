export function success<T>(data: T, message = "") {
  return Response.json({
    code: 200,
    data,
    message,
  });
}

export function error(message = "error", code = 503) {
  return Response.json(
    {
      code,
      data: null,
      message,
    },
    { status: code },
  );
}
