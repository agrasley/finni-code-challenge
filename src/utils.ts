import { LoaderFunction, LoaderFunctionArgs, redirect } from "react-router-dom";

function createFetch(method: string) {
  return async function (url = "/", data = {}) {
    const response = await fetch(`http://localhost:3030${url}`, {
      method: method,
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "manual",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    return response.json();
  };
}

export async function getData(url = "/") {
  const response = await fetch(`http://localhost:3030${url}`, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "manual",
    referrerPolicy: "no-referrer",
  });
  return response.json();
}
export const postData = createFetch("POST");
export const putData = createFetch("PUT");

export function getUser() {
  return JSON.parse(window.localStorage.getItem("user") || "null");
}

export function requireLogin(fn: LoaderFunction) {
  return (args: LoaderFunctionArgs) => {
    const user = getUser();
    if (!user) {
      return redirect("/login");
    }
    return fn(args);
  };
}

export function getAge(dateString: string) {
  const today = new Date();
  const birthDate = new Date(dateString);
  const age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1;
  }
  return age;
}
