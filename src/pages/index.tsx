import Image from "next/image";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { GetServerSideProps, GetStaticProps } from "next";
import React, { useState, useEffect, useContext } from "react";
var ua_parser = require("ua-parser-js");
import { Card, CommitCard, RepoCard } from "./components/card";
import Hero from "./components/hero";
const Footer = dynamic(() => import('./components/footer'), { ssr: false });
import Layout from "./components/layout";
import { AppContext } from "./components/layout"

interface Repository {
  name: string;
  full_name: string;
  description: string;

  fork: boolean;
  parent?: string;
  private: boolean;

  last_updated: string
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

export const getStaticProps: GetStaticProps<any> = async () => {
  const apiKey = process.env.GITHUB_API_KEY;

  // Fetch repos
  const repo_res = await fetch(
    "https://api.github.com/user/repos?sort=pushed&direction=desc",
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
    // Fetch repo information if parent
    if (fork) {
      let _repo: Repository = {
        name: name,
        full_name: fullname,
        description: description,
        fork: true,
        parent: repo_data.parent.full_name,
        private: repo.private,
        last_updated: repo_data.updated_at
      };
      sorted_repos.push(_repo);
    } else {
      let _repo: Repository = {
        name: name,
        full_name: fullname,
        description: description,
        fork: false,
        private: repo.private,
        last_updated: repo_data.updated_at
      };
      sorted_repos.push(_repo);
    }

    // Fetch commits per repo
    const commit_res = await fetch(
      "https://api.github.com/repos/" + fullname + "/commits",
      {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "Accept: application/vnd.github+json",
          Authorization: "Bearer " + apiKey,
          "X-itHub-Api-Version": "2022-11-28",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const commit_data = await commit_res.json();

    /// Github returns commit sorted descending
    /// Selected the latest 3 and then insert sort descending as well
    if (typeof commit_data.slice == "function") {
      //let commit_slice = commit_data.slice(0, 3);
      let commit_slice = commit_data.map((commit: any) => {
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
      commits: sorted_commits,
      repos: sorted_repos,
    },
  };
};

// export const getServerSideProps: GetServerSideProps<any> = async (context) => {
//   return {
//     props: {
//       headers: context.req.headers,
//     },
//   }
// };

function Logo() {
  return (
    <div className="flex m-auto mr-6 border-red">
      <div className="flex w-48 h-48 m-auto border-blue invert">
        <img src="123.png" />
      </div>
    </div>
  );
}


export default function Home({ commits, repos, headers }: ServerProps) {
  // useEffect(() => {
  //   fetch('/api/track') // replace with your API endpoint
  //     .then(response => response.json())
  //     .then(data => setData(data));
  // }, []); // Empty dependency array means this effect will only run once, when the component mounts
  return (
    <Layout>
      {/* Vertical Sizing */}
      <div className="flex flex-col h-full">
      {/* Horizontal Sizing */}
        <div className="flex flex-col w-screen grow md:px-6 2xl:px-96">
      {/* Hero Container */}
          <div className="flex flex-col w-full mt-12 sm:flex-row">
            <Logo />
            <Hero />
          </div>

          <div className="flex flex-col p-4 mt-12">
            <div id="commits" className="w-full border-blue">
              <h1 className="text-white">COMMITS</h1>
              <div
                id="commits_container"
                className="flex flex-col gap-4 p-8 overflow-x-auto sm:flex-row mx-[5%] h-[250px] 
                border-2 border-white border-solid rounded-xl"
              >
                {commits.map((commit: any) => {
                  return (
                    <CommitCard
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
                      date={commit.commit.author.date}
                      repository={commit.repository}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col p-4 mt-12 border-red">
            <div id="repos" className="w-full border-blue">
              <h1 className="text-white">REPOS</h1>
              <div className="flex flex-col gap-4 p-8 overflow-x-auto sm:flex-row mx-[5%] h-[250px]">
                {repos.map((repo: Repository) => {
                  if (repo.fork) {
                    return (
                      <RepoCard
                        key={repo.full_name}
                        title={repo.name}
                        description={repo.description}
                        fork_repo={repo.parent}
                        target={`https://github.com/${repo.full_name}`}
                        privit={repo.private}
                        last_updated={repo.last_updated}
                      />
                    );
                  } else {
                    return (
                      <RepoCard
                        key={repo.full_name}
                        title={repo.name}
                        description={repo.description}
                        target={`https://github.com/${repo.full_name}`}
                        privit={repo.private}
                        last_updated={repo.last_updated}
                      />
                    );
                  }
                })}
              </div>
            </div>
          </div>

          <Footer />
        </div>

      </div>
    </Layout>
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
