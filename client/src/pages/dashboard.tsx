import { ChangeEvent, FormEvent, useState } from "react";
import { useAppSelector } from "../app/hook";
import { useAddUrlMutation, useGetUrlsQuery } from "../features/api";
import UrlModal from "../components/urlModal";
import type { RootState } from "../app/store";

import { Link } from "react-router-dom";
import { Site } from "../types/types";
import Header from "../components/Header";
import Table from "../components/table";

const Dashboard = () => {
  const [addUrl] = useAddUrlMutation();
  const { data = [] } = useGetUrlsQuery({
    refetchOnMountOrArgChange: true,
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<Site>();
  const [url, seturl] = useState<string>("");

  const user = useAppSelector((state: RootState) => state.user);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    seturl(event.target.value);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const body = { full: url, isLogin: user ? true : false };

    try {
      if (!body) return;
      await addUrl(body);
      seturl("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="text-white h-full w-full flex flex-col justify-between relative">
      <Header user={user} />
      {/* Showcase */}
      <div className="w-full h-full flex flex-col gap-4 justify-between">
        <div className="w-full flex flex-col p-4 md:w-1/2 md:px-0 md:mx-auto lg:w-2/6">
          <div className="">
            <div className="my-16 lg:my-10">
              <span className=""></span>
              <h1 className="text-3xl font-bold text-center sm:text-5xl lg:text-5xl xl:text-7xl">
                Quickily and Reliably shortened and save your url for later!
              </h1>
            </div>

            <form
              className="w-full rounded-md flex flex-col items-center"
              onSubmit={onSubmit}
            >
              <input
                type="text"
                className="w-11/12 py-1 px-2 rounded-md bg-transparent outline-none border-b "
                placeholder="Enter Url"
                value={url}
                onChange={handleChange}
              />
              <button className="bg-blue-800 py-2 px-8 rounded-md mt-4">
                Shorten
              </button>
            </form>
          </div>
        </div>
        {/* Modal */}
        {isModalOpen ? (
          <UrlModal data={modalData} close={setIsModalOpen} />
        ) : (
          ""
        )}
        {/* Table */}
        <div className="w-full h-3/6 p-4 rounded-md bg-blue-800 md:w-3/5 md:mx-auto md:px-4">
          <h3 className="text-xl mb-4">Recent URL</h3>
          {user.userId !== "" ? (
            <div className="w-full h-full">
              <Table
                data={data}
                setIsModalOpen={setIsModalOpen}
                setModalData={setModalData}
              />
            </div>
          ) : (
            <div className="h-4/5">
              {data?.length !== 0 && !user.userId ? (
                <Table
                  data={data}
                  setIsModalOpen={setIsModalOpen}
                  setModalData={setModalData}
                />
              ) : (
                <div className="text-white h-full flex flex-col gap-4 justify-center items-center px-2 md:px-24">
                  <p className="text-center text-xl">
                    Login to save and favorite you most use short URL
                  </p>
                  <Link to="/login" className="border px-8 py-1 rounded-md">
                    Login
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
