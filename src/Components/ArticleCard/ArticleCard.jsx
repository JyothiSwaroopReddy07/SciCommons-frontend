import React from "react";

const ArticleCard = ({articles}) => {


    return (
        <ul className="mt-12 space-y-6 w-full md:w-4/5">
        {
            articles.length !== 0 ? (
            articles.map((item) => (
            <li key={item.id} className="p-5 bg-white rounded-md shadow-sm">
            <a href="/article/${item.id}">
                <div>
                <div className="justify-between sm:flex">
                    <div className="flex-1">
                    <h3 className="text-xl font-medium text-green-600">
                        {item.article_name.replace(/_/g, " ")}
                    </h3>
                    <p className="text-gray-500 mt-2 pr-2">
                        <span className="text-green-700">Authors : </span>
                        {item.authors.map((author) => (<span className="font-bold mr-2">{author}</span>))}
                    </p>
                    <p className="text-gray-500 mt-2 pr-2">
                        <span className="text-green-700">Keywords : </span>
                        {item.keywords.replace(/[\[\]"_\|\|]/g, "")}
                    </p>
                    </div>
                    <div className="mt-5 space-y-4 text-sm sm:mt-0 sm:space-y-2">
                    <span className="flex items-center text-gray-500">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className=" fill-gray-200 w-6 h-6 mr-2"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        </svg>
                        <span className="text-lg font-bold">{item.views == null ? 0 : item.views}</span>
                    </span>
                    <span className="flex items-center text-gray-500">
                        <svg
                        className="fill-pink-400 w-6 h-6 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                        </svg>
                        <span className="text-lg font-bold">{item.favourites == null ? 0 : item.favourites}</span>

                    </span>
                    </div>
                </div>
                <div className="mt-4 items-center space-y-4 text-sm sm:flex sm:space-x-4 sm:space-y-0">
                    <div className="flex items-center">
                    <div className="flex mr-2">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`h-5 w-5 ${
                            (item.rating == null ? 0 : item.rating) >= 1
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                        >
                        <path d="M12 1l2.753 8.472h8.938l-7.251 5.269 2.753 8.472L12 18.208l-7.193 5.005 2.753-8.472L.309 9.472h8.938z" />
                        </svg>

                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`h-5 w-5 ${
                            (item.rating == null ? 0 : item.rating) >= 2
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                        >
                        <path d="M12 1l2.753 8.472h8.938l-7.251 5.269 2.753 8.472L12 18.208l-7.193 5.005 2.753-8.472L.309 9.472h8.938z" />
                        </svg>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`h-5 w-5 ${
                            (item.rating == null ? 0 : item.rating) >= 3
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                        >
                        <path d="M12 1l2.753 8.472h8.938l-7.251 5.269 2.753 8.472L12 18.208l-7.193 5.005 2.753-8.472L.309 9.472h8.938z" />
                        </svg>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`h-5 w-5 ${
                            (item.rating == null ? 0 : item.rating) >= 4
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                        >
                        <path d="M12 1l2.753 8.472h8.938l-7.251 5.269 2.753 8.472L12 18.208l-7.193 5.005 2.753-8.472L.309 9.472h8.938z" />
                        </svg>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`h-5 w-5 ${
                            (item.rating == null ? 0 : item.rating) >= 5
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                        >
                        <path d="M12 1l2.753 8.472h8.938l-7.251 5.269 2.753 8.472L12 18.208l-7.193 5.005 2.753-8.472L.309 9.472h8.938z" />
                        </svg>
                        <span className="font-bold ml-3">
                        {item.rating == null ? 0 : item.rating}/5
                        </span>
                    </div>
                    </div>
                </div>
                </div>
            </a>
            </li>
            ))):(<h1 className="text-2xl font-bold text-gray-500">No Articles Found</h1>)
        }
        </ul>
  );
};

export default ArticleCard;
