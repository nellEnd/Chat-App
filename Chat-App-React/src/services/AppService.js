
export const loginUser = async (username, password) => {
    const response = await fetch ("https://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({username, password}),
    });
    if(!response)
        throw new Error("Username or password is incorrect.");

    return await response.json();
}