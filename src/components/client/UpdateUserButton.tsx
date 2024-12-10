"use client";

import { Button } from "../ui/button";
import { useState } from "react";

const UpdateUserButton = ({ user }: any) => {
  const { id, userRolePairings } = user;
  const [isAdmin, setAdmin] = useState(
    userRolePairings.some((r: any) => r.role.name === "admin")
  );

  const setAdminRights = async (value: boolean) => {
    const response = await fetch(`/api/updateUser`, {
      method: "POST",
      body: JSON.stringify({
        userId: id,
        admin: value,
      }),
    });

    console.log(response);

    if (response.status === 200) {
      setAdmin(value);
    }
  };

  if (isAdmin) {
    return (
      <Button size="sm" onClick={() => setAdminRights(false)}>
        Remove Admin Rights
      </Button>
    );
  }

  return (
    <Button size="sm" onClick={() => setAdminRights(true)}>
      Give Admin Rights
    </Button>
  );
};

export default UpdateUserButton;
