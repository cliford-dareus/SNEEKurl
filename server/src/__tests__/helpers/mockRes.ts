export function createMockRes() {
  const res: any = {
    statusCode: 200,
    body: undefined as any,
    redirectedTo: undefined as string | undefined,
  };
  res.status = (code: number) => { res.statusCode = code; return res; };
  res.json = (data: any) => { res.body = data; return res; };
  res.send = (data: any) => { res.body = data; return res; };
  res.sendStatus = (code: number) => { res.statusCode = code; return res; };
  res.redirect = (url: string) => { res.statusCode = 302; res.redirectedTo = url; return res; };
  res.cookie = () => res;
  res.clearCookie = () => res;
  return res;
}

export function createMockReq(overrides: Record<string, any> = {}) {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    signedCookies: {},
    cookies: {},
    session: {},
    socket: { remoteAddress: '127.0.0.1' },
    connection: { remoteAddress: '127.0.0.1' },
    ...overrides,
  };
}
