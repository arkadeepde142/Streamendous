import React, { createContext, SetStateAction, useState } from "react";
export interface User {
  email: string;
  username: string;
  token: string;
  firstName: string;
  lastName: string;
}
type UserContextType = [User|null , React.Dispatch<React.SetStateAction<User|null>>]
const userContext = createContext<UserContextType>([null, ()=>{}]);
export default userContext;