import Image from "next/image";
import { Inter } from "next/font/google";
import { GetServerSideProps } from "next";
import config from "./config.json";
import React, { useState, useContext, useEffect } from "react";
import AppContext from "../context.js";
var ua_parser = require("ua-parser-js");

const inter = Inter({ subsets: ["latin"] });

interface Repository {
  name: string;
  full_name: string;
  description: string;

  fork: boolean;
  parent?: string;
}

interface Commit {
  sha: string;
  message: string;
  repository: string;
  author: string;
}

interface ServerProps {
  commits: Commit[];
  repos: Repository[];
  headers: any;
}
//curl -L   -H    -H    -H

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  const apiKey = process.env.GITHUB_API_KEY;

  // Fetch repos
  const repo_res = await fetch(
    "https://api.github.com/user/repos?sort=updated&direction=desc",
    {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: "Bearer " + apiKey,
        "X-GitHub-Api-Version": "2022-11-28",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  const repos = await repo_res.json();
  let sorted_repos = [];
  let sorted_commits = [];
  for (let repo of repos) {
    let name = repo.name;
    let fullname = repo.full_name;
    let fork = repo.fork;
    let description = repo.description;

    // Fetch repo information if parent
    if (fork) {
      const repo_res = await fetch("https://api.github.com/repos/" + fullname, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "Accept: application/vnd.github+json",
          Authorization: "Bearer " + apiKey,
          "X-GitHub-Api-Version": "2022-11-28",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const repo_data = await repo_res.json();
      let repo: Repository = {
        name: name,
        full_name: fullname,
        description: description,
        fork: true,
        parent: repo_data.parent.full_name,
      };
      sorted_repos.push(repo);
    } else {
      let repo: Repository = {
        name: name,
        full_name: fullname,
        description: description,
        fork: false,
      };
      sorted_repos.push(repo);
    }

    // Fetch commits per repo
    const commit_res = await fetch(
      "https://api.github.com/repos/" + fullname + "/commits",
      {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "Accept: application/vnd.github+json",
          Authorization: "Bearer " + apiKey,
          "X-GitHub-Api-Version": "2022-11-28",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const commit_data = await commit_res.json();

    /// Github returns commit sorted descending
    /// Selected the latest 3 and then insert sort descending as well
    if (typeof commit_data.slice == "function") {
      let commit_slice = commit_data.slice(0, 3);
      commit_slice = commit_slice.map((commit: any) => {
        return {
          ...commit,
          repository: fullname,
        };
      });
      sorted_commits.push(...commit_slice);
    }
  }
  sorted_commits = sorted_commits.sort(
    (a, b) =>
      new Date(b.commit.author.date).getTime() -
      new Date(a.commit.author.date).getTime()
  );
  // const accept_type = "Accept: application/vnd.github+json";
  //"Authorization: Bearer <YOUR-TOKEN>" \

  return {
    props: {
      commits: sorted_commits.splice(0, 3),
      repos: sorted_repos,
      headers: context.req.headers,
    },
  };
};

function Logo() {
  return (
    <div className="flex m-auto mr-6 border-red">
      <div className="flex w-48 h-48 m-auto border-blue invert">
        <img src="123.png" />
      </div>
    </div>
  );
}

function HeroContent({ props }: any) {
  return (
    <div className="flex flex-col m-auto ml-6 border-green">
      <h1 className="block w-full text-4xl text-white">This Is</h1>
      <h1 className="block w-full my-2 text-3xl text-white">
        {" "}
        root
        <wbr />
        @nokernel.space
      </h1>
      <div className="flex flex-col gap-4 my-4 sm:flex-row">
        <div className="flex items-center justify-center text-center text-white rounded-lg cursor-pointer outline outline-gray-400 border-green min-w-24 min-h-16">
          Blog
        </div>
        <div className="flex items-center justify-center text-center text-white rounded-lg cursor-pointer outline outline-gray-400 border-green min-w-24 min-h-16">
          Github
        </div>
      </div>
    </div>
  );
}

function Card({ title, description, author, repository, target }: any) {
  const appContext = useContext(AppContext);

  const handleClick = () => {
    appContext.setLoading(1);
  };

  return (
    <div className="basis-1/3 h-full border-green card-anim min-w-[200px]">
      <div className="relative flex justify-between block p-6 pt-4 bg-black border border-gray-100 rounded-lg shadow-md min-h-[200px] flex-col">
        <div className="flex flex-col justify-start">
          <p className="text-sm font-normal text-white">{author}</p>

          <h5 className="mb-1 text-2xl font-bold tracking-tight text-white opacity-70">
            {title}
          </h5>
          <p className="font-normal text-white text-s text-clip">
            {description}
          </p>
        </div>

        {/*
        Card Footer  
      */}
        <div className="flex flex-row gap-2 justify-around max-h-[24px] items-center">
          <a href={target} target="_blank" className="p-1 link">
            <img src="github.svg" width="24px" height="24px" alt="" />
          </a>
          {repository != undefined ? (
            <div className="flex flex-row border-solid border-2 border-white-500 rounded-lg p-1 max-w-[75%] ">
              <div className="invert">
                <svg
                  className="w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 500 500"
                  enable-background="new 0 0 500 500"
                >
                  <g>
                    <g>
                      <circle cx="141" cy="429.1" r="3.6" />
                      <g>
                        <path d="M163.6,429.1c0,1-0.8,5.7-0.1,2.8c-0.4,1.5-0.7,3-1.1,4.5c-0.2,0.6-0.4,1.2-0.6,1.9c0.9-2.6,0.3-0.6,0,0     c-0.8,1.5-1.7,3-2.6,4.5c-1.5,2.4-0.4,0.5,0,0c-0.6,0.6-1.1,1.3-1.7,1.9c-0.6,0.6-1.3,1.2-1.8,1.8c-0.1,0.1-1.8,1.5-0.5,0.5     c1.1-0.9-2.1,1.4-2.7,1.7c-0.7,0.4-1.5,0.8-2.3,1.2c-2.4,1.3,1-0.2-0.6,0.3c-1.5,0.4-2.9,0.9-4.4,1.3c-2.7,0.7-0.7,0.2,0,0.1     c-0.9,0.1-1.8,0.2-2.7,0.2c-1.6,0.1-3.2-0.1-4.8-0.1c-1.8-0.1,0.4,0,0.6,0.1c-1.1-0.3-2.2-0.4-3.2-0.7c-0.9-0.3-4.5-1.6-2-0.5     c-1.6-0.7-3.1-1.5-4.6-2.5c-0.7-0.5-1.4-0.9-2.1-1.5c0.2,0.1,1.8,1.5,0.5,0.3c-1.4-1.3-2.8-2.7-4.1-4.1c1.8,2-0.5-0.8-1-1.7     c-0.8-1.3-1.5-2.6-2.1-4c1.3,2.9-0.5-1.9-0.7-2.6c-0.2-0.6-0.3-1.3-0.4-1.9c-0.4-1.6,0,2.2-0.1-0.7c0-1.6-0.1-3.2,0-4.8     c0-0.5,0.4-3.3,0.1-1.4c-0.3,1.8,0.1-0.4,0.2-0.6c0.5-1.7,0.9-3.4,1.5-5.1c-1,2.8,0.8-1.4,1.3-2.3c0.4-0.7,3.4-4.5,1.4-2.2     c1-1.1,2-2.2,3.1-3.3c0.4-0.5,1-0.9,1.4-1.3c-2,1.8-0.5,0.4,0,0c1.7-1,3.3-2,5-2.9c1.5-0.8-0.4,0.2-0.6,0.2     c0.8-0.3,1.7-0.6,2.5-0.8c0.8-0.2,4.6-1.1,3.2-0.8c-1.4,0.3,2.7-0.1,3.4-0.1c0.9,0,1.8,0.1,2.7,0.1c2.9,0.1-1-0.3,0.7,0.1     c1.9,0.5,3.8,1,5.7,1.6c-2.7-0.9,1.3,0.7,2.3,1.3c1,0.6,4.3,3.2,2.2,1.4c1.5,1.3,2.8,2.6,4.1,4.1c1.5,1.6-1.2-1.9,0,0     c0.6,0.9,1.2,1.8,1.8,2.7c0.5,0.9,2.2,5,1.3,2.3c0.6,1.7,1,3.4,1.5,5.1c0.7,2.7,0.2,0.7,0.1,0     C163.6,426.4,163.6,427.8,163.6,429.1c0.1,7.8,6.8,15.4,15,15c8-0.4,15.2-6.6,15-15c-0.4-22.5-14.3-42.1-35.5-49.7     c-19.9-7.2-44-0.6-57.3,15.9c-13.9,17.1-16.5,41.2-5.2,60.4c11.5,19.6,34.2,29,56.2,24.9c24.4-4.5,41.4-27.3,41.9-51.5     c0.1-7.8-7-15.4-15-15C170.4,414.5,163.8,420.7,163.6,429.1z" />
                      </g>
                    </g>
                    <g>
                      <circle cx="141" cy="71" r="37.6" />
                      <g>
                        <path d="M163.6,71c0,1-0.8,5.7-0.1,2.8c-0.4,1.5-0.7,3-1.1,4.5c-0.2,0.6-0.4,1.2-0.6,1.9c0.9-2.6,0.3-0.6,0,0     c-0.8,1.5-1.7,3-2.6,4.5c-1.5,2.4-0.4,0.5,0,0c-0.6,0.6-1.1,1.3-1.7,1.9c-0.6,0.6-1.3,1.2-1.8,1.8c-0.1,0.1-1.8,1.5-0.5,0.5     c1.1-0.9-2.1,1.4-2.7,1.7c-0.7,0.4-1.5,0.8-2.3,1.2c-2.4,1.3,1-0.2-0.6,0.3c-1.5,0.4-2.9,0.9-4.4,1.3c-2.7,0.7-0.7,0.2,0,0.1     c-0.9,0.1-1.8,0.2-2.7,0.2c-1.6,0.1-3.2-0.1-4.8-0.1c-1.8-0.1,0.4,0,0.6,0.1c-1.1-0.3-2.2-0.4-3.2-0.7c-0.9-0.3-4.5-1.6-2-0.5     c-1.6-0.7-3.1-1.5-4.6-2.5c-0.7-0.5-1.4-0.9-2.1-1.5c0.2,0.1,1.8,1.5,0.5,0.3c-1.4-1.3-2.8-2.7-4.1-4.1c1.8,2-0.5-0.8-1-1.7     c-0.8-1.3-1.5-2.6-2.1-4c1.3,2.9-0.5-1.9-0.7-2.6c-0.2-0.6-0.3-1.3-0.4-1.9c-0.4-1.6,0,2.2-0.1-0.7c0-1.6-0.1-3.2,0-4.8     c0-0.5,0.4-3.3,0.1-1.4c-0.3,1.8,0.1-0.4,0.2-0.6c0.5-1.7,0.9-3.4,1.5-5.1c-1,2.8,0.8-1.4,1.3-2.3c0.4-0.7,3.4-4.5,1.4-2.2     c1-1.1,2-2.2,3.1-3.3c0.4-0.5,1-0.9,1.4-1.3c-2,1.8-0.5,0.4,0,0c1.7-1,3.3-2,5-2.9c1.5-0.8-0.4,0.2-0.6,0.2     c0.8-0.3,1.7-0.6,2.5-0.8c0.8-0.2,4.6-1.1,3.2-0.8c-1.4,0.3,2.7-0.1,3.4-0.1c0.9,0,1.8,0.1,2.7,0.1c2.9,0.1-1-0.3,0.7,0.1     c1.9,0.5,3.8,1,5.7,1.6c-2.7-0.9,1.3,0.7,2.3,1.3c1,0.6,4.3,3.2,2.2,1.4c1.5,1.3,2.8,2.6,4.1,4.1c1.5,1.6-1.2-1.9,0,0     c0.6,0.9,1.2,1.8,1.8,2.7c0.5,0.9,2.2,5,1.3,2.3c0.6,1.7,1,3.4,1.5,5.1c0.7,2.7,0.2,0.7,0.1,0C163.6,68.3,163.6,69.7,163.6,71     c0.1,7.8,6.8,15.4,15,15c8-0.4,15.2-6.6,15-15c-0.4-22.5-14.3-42.1-35.5-49.7c-19.9-7.2-44-0.6-57.3,15.9     c-13.9,17.1-16.5,41.2-5.2,60.4c11.5,19.6,34.2,29,56.2,24.9c24.4-4.5,41.4-27.3,41.9-51.5c0.1-7.8-7-15.4-15-15     C170.4,56.4,163.8,62.6,163.6,71z" />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M125.3,109c0,31.9,0,63.9,0,95.8c0,50.9,0,101.7,0,152.6c0,11.6,0,23.2,0,34.7c0,7.8,6.9,15.4,15,15     c8.1-0.4,15-6.6,15-15c0-31.9,0-63.9,0-95.8c0-50.9,0-101.7,0-152.6c0-11.6,0-23.2,0-34.7c0-7.8-6.9-15.4-15-15     C132.2,94.4,125.3,100.6,125.3,109L125.3,109z" />
                      </g>
                    </g>
                    <g>
                      <circle cx="358.9" cy="147.4" r="37.6" />
                      <g>
                        <path d="M381.5,147.4c0,1-0.8,5.7-0.1,2.8c-0.4,1.5-0.7,3-1.1,4.5c-0.2,0.6-0.4,1.2-0.6,1.9c0.9-2.6,0.3-0.6,0,0     c-0.8,1.5-1.7,3-2.6,4.5c-1.5,2.4-0.4,0.5,0,0c-0.6,0.6-1.1,1.3-1.7,1.9c-0.6,0.6-1.3,1.2-1.8,1.8c-0.1,0.1-1.8,1.5-0.5,0.5     c1.1-0.9-2.1,1.4-2.7,1.7c-0.7,0.4-1.5,0.8-2.3,1.2c-2.4,1.3,1-0.2-0.6,0.3c-1.5,0.4-2.9,0.9-4.4,1.3c-2.7,0.7-0.7,0.2,0,0.1     c-0.9,0.1-1.8,0.2-2.7,0.2c-1.6,0.1-3.2-0.1-4.8-0.1c-1.8-0.1,0.4,0,0.6,0.1c-1.1-0.3-2.2-0.4-3.2-0.7c-0.9-0.3-4.5-1.6-2-0.5     c-1.6-0.7-3.1-1.5-4.6-2.5c-0.7-0.5-1.4-0.9-2.1-1.5c0.2,0.1,1.8,1.5,0.5,0.3c-1.4-1.3-2.8-2.7-4.1-4.1c1.8,2-0.5-0.8-1-1.7     c-0.8-1.3-1.5-2.6-2.1-4c1.3,2.9-0.5-1.9-0.7-2.6c-0.2-0.6-0.3-1.3-0.4-1.9c-0.4-1.6,0,2.2-0.1-0.7c0-1.6-0.1-3.2,0-4.8     c0-0.5,0.4-3.3,0.1-1.4c-0.3,1.8,0.1-0.4,0.2-0.6c0.5-1.7,0.9-3.4,1.5-5.1c-1,2.8,0.8-1.4,1.3-2.3c0.4-0.7,3.4-4.5,1.4-2.2     c1-1.1,2-2.2,3.1-3.3c0.4-0.5,1-0.9,1.4-1.3c-2,1.8-0.5,0.4,0,0c1.7-1,3.3-2,5-2.9c1.5-0.8-0.4,0.2-0.6,0.2     c0.8-0.3,1.7-0.6,2.5-0.8c0.8-0.2,4.6-1.1,3.2-0.8c-1.4,0.3,2.7-0.1,3.4-0.1c0.9,0,1.8,0.1,2.7,0.1c2.9,0.1-1-0.3,0.7,0.1     c1.9,0.5,3.8,1,5.7,1.6c-2.7-0.9,1.3,0.7,2.3,1.3c1,0.6,4.3,3.2,2.2,1.4c1.5,1.3,2.8,2.6,4.1,4.1c1.5,1.6-1.2-1.9,0,0     c0.6,0.9,1.2,1.8,1.8,2.7c0.5,0.9,2.2,5,1.3,2.3c0.6,1.7,1,3.4,1.5,5.1c0.7,2.7,0.2,0.7,0.1,0C381.5,144.6,381.5,146,381.5,147.4     c0.1,7.8,6.8,15.4,15,15c8-0.4,15.2-6.6,15-15c-0.4-22.5-14.3-42.1-35.5-49.7c-19.9-7.2-44-0.6-57.3,15.9     c-13.9,17.1-16.5,41.2-5.2,60.4c11.5,19.6,34.2,29,56.2,24.9c24.4-4.5,41.4-27.3,41.9-51.5c0.1-7.8-7-15.4-15-15     C388.3,132.8,381.7,139,381.5,147.4z" />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M150.9,362.1c6.6-6.7,13-13.6,20.5-19.3c-0.8,0.6,1.9-1.4,2.4-1.7c1.6-1.1,3.2-2.2,4.9-3.3     c3.1-2,6.2-3.8,9.5-5.5c3.8-2,7.9-3.9,10.7-4.9c11.2-4.4,22.5-8.7,33.8-13c14.3-5.5,28.7-11,43-16.6     c18.6-7.2,35.5-16.1,50.6-29.3c22.7-19.8,39-47.4,45.6-76.8c1.7-7.6-2.3-16.6-10.5-18.5c-7.6-1.7-16.6,2.3-18.5,10.5     c-1.3,5.7-2.9,11.4-5,16.8c-0.2,0.7-1.7,4.4-1.4,3.6c0.6-1.4-0.4,0.8-0.4,0.9c-0.3,0.7-0.6,1.3-0.9,2c-1.4,3-3,6-4.6,9     c-1.5,2.7-3.2,5.4-4.9,8c-0.8,1.2-1.6,2.4-2.4,3.5c-0.5,0.8-2.7,3.6-2.3,3.1c0.4-0.5-1.8,2.2-2.4,2.9c-0.9,1.1-1.9,2.2-2.8,3.2     c-2.3,2.5-4.6,4.9-7,7.2c-2.1,2-4.2,3.9-6.5,5.7c-0.7,0.6-1.5,1.2-2.2,1.8c0.2-0.2,1.6-1.2,0.2-0.2c-1.4,1-2.7,2-4.1,2.9     c-5.4,3.7-11.1,7-16.9,9.8c-1.3,0.6-2.6,1.2-4,1.9c-1.6,0.7-0.1,0.1,0.2-0.1c-0.7,0.3-1.4,0.6-2.1,0.8c-0.4,0.2-0.8,0.3-1.3,0.5     c-1.4,0.5-2.8,1.1-4.2,1.6c-25.6,9.8-51.1,19.6-76.7,29.5c-12.5,4.9-24.5,10.8-35.3,18.9c-9.6,7.1-17.9,15.2-26.2,23.7     c-5.7,5.8-5.8,15.5,0,21.2C135.4,367.8,145.2,367.9,150.9,362.1L150.9,362.1z" />
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <p
                className="text-white overflow-x-clip whitespace-nowrap text-clip"
                dir="rtl"
              >
                {repository}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function Home({ commits, repos, headers }: ServerProps) {
  const clientHints =
    "sec-ch-ua" in headers ? ClientHints(headers["sec-ch-ua"]) : {};
  const userAgents = ua_parser(headers["user-agent"]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [isVisible, setIsVisible] = useState("");
  const [isFocus, setIsFocus] = useState("");

  // useEffect(() => {
  //   const onFocus = () => setIsTabFocused(true);
  //   const onBlur = () => setIsTabFocused(false);

  //   window.addEventListener("focus", onFocus);
  //   window.addEventListener("blur", onBlur);

  //   return () => {
  //     window.removeEventListener("focus", onFocus);
  //     window.removeEventListener("blur", onBlur);
  //   };
  // }, []);
  useEffect(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const handleVisibilityChange = (event: any) => {
        setIsVisible(document.visibilityState);
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      setIsVisible(document.visibilityState);
      setIsFocus(document.hasFocus() ? "focus" : "blur");

      const onFocus = () => setIsFocus("focus");
      const onBlur = () => setIsFocus("blur");

      window.addEventListener("focus", onFocus);
      window.addEventListener("blur", onBlur);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        window.removeEventListener("focus", onFocus);
        window.removeEventListener("blur", onBlur);
      };
    }
  }, []);

  const handleMouseMove = (event: any) => {
    setMousePosition({
      x: event.clientX,
      y: event.clientY,
    });
  };
  console.log(commits);

  return (
    <div onMouseMove={handleMouseMove} className="flex flex-col h-full">
      <div className="flex flex-col w-screen grow md:px-6 2xl:px-96">
        <div className="flex flex-col w-full mt-12 sm:flex-row">
          <Logo />
          <HeroContent />
        </div>

        <div className="flex flex-col p-4 mt-12 border-red">
          <div id="commits" className="w-full border-blue">
            <h1 className="text-white">COMMITS</h1>
            <div
              id="commits_container"
              className="flex flex-col gap-4 p-8 overflow-x-auto sm:flex-row"
            >
              {commits.map((commit: any) => {
                return (
                  <Card
                    key={commit.sha}
                    sha={commit.sha}
                    title={commit.sha.substring(0, 6)}
                    description={commit.commit.message}
                    author={commit.commit.author.name}
                    target={
                      "https://github.com/" +
                      commit.repository +
                      "/commit/" +
                      commit.sha
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col p-4 mt-12 border-red">
          <div id="repos" className="w-full border-blue">
            <h1 className="text-white">REPOS</h1>
            <div className="flex flex-col gap-4 p-8 overflow-x-auto sm:flex-row">
              {repos.map((repo: Repository) => {
                if (config.projects.includes(repo.full_name)) {
                  if (repo.fork) {
                    return (
                      <Card
                        key={repo.full_name}
                        title={repo.name}
                        description={repo.description}
                        repository={repo.parent}
                        target={`https://github.com/${repo.full_name}`}
                      />
                    );
                  } else {
                    return (
                      <Card
                        key={repo.full_name}
                        title={repo.name}
                        description={repo.description}
                        target={`https://github.com/${repo.full_name}`}
                      />
                    );
                  }
                }
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row">
        <div className="flex flex-col justify-end order-2 px-8 py-2 text-white basis-1/3 sm:order-none">
          <h3>nokernel.space</h3>
          <p>
            Made with <span style={{ color: "#BA6573" }}>❤</span> by Root
          </p>
          <div className="flex flex-row">
            <a
              href="https://github.com/nokernelspace"
              target="_blank"
              className="p-1 link"
            >
              <img src="github.svg" width="30px" height="30px" alt="" />
            </a>
            <a
              href="https://soundcloud.com/nokernelspace"
              target="_blank"
              className="p-1 link"
            >
              <img src="soundcloud.svg" width="36px" height="36px" alt="" />
            </a>

            <a
              href="https://twitter.com/nokernelspace"
              target="_blank"
              className="p-1 link"
            >
              <img src="twitter.svg" width="36px" height="36px" alt="" />
            </a>
          </div>
          <p style={{ color: "#818181", fontSize: "smaller" }}>
            2024 © All Rights Reserved
          </p>
        </div>
        <div className="flex flex-col justify-end px-8 py-2 text-right basis-1/3 sm:text-left">
          <p
            className="box-border flex justify-between mb-2 text-white cursor-pointer md:underline md:underline-offset-2"
            data-title="nokernelspace is a collective based in San Francisco"
          >
            <span className="invisible md:visible"> About</span>
          </p>
          <p
            className="box-border flex justify-between text-white cursor-pointer md:underline md:underline-offset-2"
            data-title="Creativity for All"
          >
            <span className="invisible md:visible">Our Mission</span>
          </p>
          <p
            className="flex justify-between cursor-pointer text-stone-500"
            data-title="🚧 wip"
          >
            <span className="invisible md:visible">Products</span>
          </p>
          <p
            className="box-border flex justify-between text-white cursor-pointer md:underline md:underline-offset-2"
            data-title="root@nokernel.space"
          >
            <span className="invisible md:visible"> Partner with us</span>
          </p>
        </div>
        <div className="flex flex-col justify-end px-8 py-2 text-right basis-1/3 sm:text-left">
          <p className="text-white">
            {userAgents["browser"]["name"] +
              " v" +
              userAgents["browser"]["version"]}{" "}
            {userAgents["engine"]["name"] +
              " v" +
              userAgents["engine"]["version"]}
            <br />
            {userAgents["device"]["vendor"] != undefined
              ? userAgents["device"]["vendor"] +
                  " " +
                  userAgents["device"]["model"] +
                  " (" +
                  userAgents["device"]["type"] ==
                undefined
                ? userAgents["device"]["type"] + ")"
                : ""
              : ""}
            {userAgents["os"]["name"] != undefined
              ? userAgents["os"]["name"] + " " + userAgents["os"]["version"]
              : ""}
          </p>

          <p className="text-white">{headers["x-forwarded-for"]}:</p>
          <p className="text-white">
            {mousePosition.x} {mousePosition.y} | {isVisible.toString()} |{" "}
            {isFocus.toString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function ClientHints(ua: string): { [key: string]: number } {
  // ""Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123""
  var res: { [key: string]: number } = {};
  for (const a of ua.split(",")) {
    const mapping: Array<string> = a.split(";");
    res[mapping[0].replaceAll('"', "").replaceAll(" ", "")] = parseFloat(
      mapping[1].split("=")[1].replaceAll('"', "").replaceAll(" ", "")
    );
  }
  return res;
}
