import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);

  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    show: false,
    msg: "",
  });

  const searchGithubUser = async (user) => {
    toggleError();
    setLoading(true);
    try {
      const { data } = await axios(`${rootUrl}/users/${user}`);
      setGithubUser(data);
      const { login, followers_url } = data;
      // const repos = await axios(`${rootUrl}/users/${login}/repos?per_page=100`);
      // const followers = await axios(`${followers_url}?per_page=100`);
      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ]).then((results) => {
        const [repos, followers] = results;
        const status = "fulfilled";
        if (repos.status === status) {
          setRepos(repos.value.data);
        }
        if (followers.status === status) {
          setFollowers(followers.value.data);
        }
      });
      // setRepos(repos.data);
      // setFollowers(followers.data);
      setLoading(false);
    } catch (error) {
      toggleError(true, "There is no user with that username");
    }
    checkRequests();
    setLoading(false);
  };

  // check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;

        setRequests(remaining);
        if (remaining === 0) {
          toggleError(true, "sorry, you have exceeded your hourly rate limit!");
        }
      })
      .catch((err) => console.log(err));
  };

  const toggleError = (show = false, msg = "") => {
    setErrors({ show, msg });
  };

  useEffect(checkRequests, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        errors,
        searchGithubUser,
        loading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubContext, GithubProvider };
