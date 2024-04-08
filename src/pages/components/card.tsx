import { GetServerSideProps } from "next";
import { useEffect } from "react"
import { ComponentTest } from "./test";


export const getServerSideProps = (async () => {
    // Fetch data from external API
    // const res = await fetch('https://api.github.com/repos/vercel/next.js')
    // const repo: Repo = await res.json()
    // Pass data to the page via props
    return {
        props: {
            title: "asdasd",
            description: "asdasd",
            author: "asdasd",
            repository: "asdasd",
            target: "asdasd"
        }
    }
}) satisfies GetServerSideProps<any>

export function RepoCard({ title, description, fork_repo, target, privit, last_updated }: any) {
    let _last_updated: Date | null = last_updated != undefined ? new Date(last_updated) : null;

    return (<Card
        header={
            <div className="flex flex-col justify-start">
                <div className="flex flex-row justify-between">
                    {title ? <h5 className="mb-1 text-2xl font-bold tracking-tight text-white opacity-70"> {title} </h5> : null}
                    {_last_updated ? <p className="text-xs font-normal text-right text-white"> {
                        `${_last_updated.getUTCMonth() + 1}/${_last_updated.getUTCDate()}/${_last_updated.getUTCFullYear()}`
                    } </p> : null}
                </div>
                {description && !privit ? <p className="font-normal text-white text-s text-clip h-[75px] overflow-y-clip overflow-x-clip"> {description} </p> : null}
                {!description && !privit ? <p className="h-[75px]"></p> : null}

            </div>
        }
        body={
            privit ? (<p className="italic text-center text-gray-500 h-[75px] content-center">This Repo is private</p>) : null
        }
        footer={
            <div className="flex flex-row items-center justify-around gap-2 max-h">
                {
                    privit ? (<div className="w-full h-[24px] bg-white barberpole" />) : null
                }
                {
                    !privit ?
                        (<a href={target} target="_blank" className="p-1 bg-black rounded-full link invert-out hover:invert-in">
                            <img src="/github.svg" width="24px" height="24px" alt="" />
                        </a>) : null
                }
                {fork_repo != undefined && privit == false ? (
                    <div className="flex flex-row border-solid border-2 border-white-500 rounded-lg p-1 max-w-[75%] border bg-black invert-out hover:invert-in hover:cursor-pointer">
                        <div className="invert">
                            <img src="/tree.svg" width="24px" height="24px" alt="" />
                        </div>
                        <a className="max-w-[100px]" href={`https://github.com/${fork_repo}`} target="_blank" rel="noopener noreferrer">
                            <p
                                className="text-white overflow-x-clip whitespace-nowrap text-clip "
                                dir="rtl"
                            >
                                {fork_repo}
                            </p>
                        </a>
                    </div>
                ) : null}
            </div>
        }
    />)
}

export function CommitCard({ title, description, author, repository, target, date, privit }: any) {
    let _date = new Date(date);

    return (<Card
        suppressHydrationWarning={true}
        header={
            <div className="flex flex-col justify-start">
                <p className="text-sm font-normal text-white">{author}</p>

                <h5 className="mb-1 text-2xl font-bold tracking-tight text-white opacity-70">
                    {title}
                </h5>
                <p className="font-normal text-white text-s text-clip h-[75px] overflow-y-clip overflow-x-clip">
                    {description}
                </p>
            </div>
        }
        footer={
            <div className="flex flex-row items-center justify-between gap-2 max-h">
                <p className="text-white">{
                    `${_date.getUTCMonth() + 1}/${_date.getUTCDate()}/${_date.getUTCFullYear()}`
                }</p>
                {repository != undefined ? (
                    <div className="flex flex-row p-1 max-w-[75%] bg-black hover:cursor-pointer invert-out hover:invert-in">
                        <img src="/github.svg" width="12px" height="12px" alt="" />
                        <p
                            className="text-white overflow-x-clip whitespace-nowrap text-clip "
                        >
                            {`/${repository.split("\/")[1]}`}
                        </p>
                    </div>
                ) : null}
            </div>
        }
    />)
}

export function Card({ header, footer, body }: any) {
    return (
        <div className="basis-1/3 h-full border-green card-anim min-w-[300px]">
            <div className="relative flex flex-col justify-between block h-full p-6 py-1 bg-black border border-gray-100 rounded-lg shadow-md">
                {header}
                {body}
                {footer}
            </div>
        </div>
    );
}


export default function Test() {
    return (
        <ComponentTest>
            <RepoCard
                key={"test_repo_card"}
                title={"Hello World [REPO]"}
                description={"This is a test repo card"}
            />

            <RepoCard
                key={"test_repo_card_2"}
                title={"Hello World [REPO] 2"}
                description={"This is a test repo card 2"}
                fork_repo={"this/is/a/fork"}
                target={`https://google.com`}
            />
            <CommitCard
                title={"Hello Commit"}
                description={"This is a test commit card"}
                author={"drummpft"}
                target={"https://google.com"}
                date={new Date()}
            />
        </ComponentTest>
    );
}