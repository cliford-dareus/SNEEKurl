export const parse = (json: any) => {
  if (typeof json === "string") {
    json = JSON.parse(json);
  }

  const profile = {
    id: String(json.id),
    nodeId: json.node_id,
    displayName: json.name,
    username: json.login,
    profileUrl: json.html_url,
  } as Profile;

  if (json.email) {
    profile.emails = [{ value: json.email }];
  }

  if (json.avatar_url) {
    profile.photos = [{ value: json.avatar_url }];
  }

  return profile;
};

interface Profile {
  id: string;
  nodeId: any;
  displayName: any;
  username: any;
  profileUrl: any;
  emails: any;
  photos: any;
  provider?: string;
  _raw: any;
  _json: any;
}