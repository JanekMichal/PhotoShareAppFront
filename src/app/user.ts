export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  roles: {
    id: number,
    name: string
  };
}
