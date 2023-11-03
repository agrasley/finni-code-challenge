function createFetch(method: string) {
  return async function (url = "/", data = {}) {
    const response = await fetch(`http://localhost:3030${url}`, {
      method: method,
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
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

export const postData = createFetch("POST");
