import { useShortenUrlMutation } from "../../app/services/urlapi";
import Urlform from "./urlform";
import Button from "../../components/ui/button";
import { useAppSelector } from "../../app/hook";

type Props = {};

const UrlManager = (props: Props) => {
  const user = useAppSelector((state) => state.auth.user);
  const [atemptShorten, { data, isLoading, isSuccess }] =
    useShortenUrlMutation();

  if (isLoading) {
    return (
      <div className="">
        <span>Loading...</span>
      </div>
    );
  }

  if (data?.message) {
    return (
      <div className="flex flex-col mt-4 ">
        <p className="text-xl font-bold  text-red-500">{data.message}</p>
        <p className="my-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
          perspiciatis, totam molestiae labore saepe harum?
        </p>
        <Button classnames="mt-auto">Create your free account</Button>
      </div>
    );
  }

  return <Urlform shortenFn={atemptShorten} />;
};

export default UrlManager;
