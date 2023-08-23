import React, { useState } from "react";
import pencil from "./pencil.png";
import { Collapse, Ripple, initTE } from "tw-elements";

initTE({ Collapse, Ripple });

const Comments = ({ comment }) => {

  const [show, setShow] = useState(true);
  const [innerCmt, setInnerCmt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [repliesData, setRepliesData] = useState([]);



  return (
    <>
      <div key={comment.id}>
        <div className="box-content bg-[#efece3]  border-[#3f6978] border-solid  p-4 mt-4 mb-4 ">
          <div
            className="flex flex-col"
            style={{
              flexDirection: "column",
              position: "absolute",
              left: "138px",
            }}
          >
            <button
              className=" "
              style={{
                minWidth: "auto",
                borderWidth: "1px",
                padding: "0 2px",
                fontWeight: "400",
                lineHeight: "13px",
                fontSize: "12px",
                borderTopRightRadius: "2px",
                borderTopLeftRadius: "2px",
                width: "100%",
                display: "block",
                color: "#4d8093",
                backgroundColor: "#fffdfa",
                border: "2px solid #3f6978",
                cursor:"pointer",
              }}
              onClick={() => setShow(false)}
            >
              −
            </button>
            <button style={{cursor:"pointer"}} onClick={() => setShow(true)}>
              ＝
            </button>
            <button style={{cursor:"pointer"}} onClick={() => setInnerCmt(true)}>
              ≡
            </button>
          </div>
          <div className="flex ">
            <div className="comments w-full md:w-auto ">
              <div className="flex">
                <span
                  className="md:font-bold  relative  text-[#2c3a4a]  leading-[1.25rem]"
                  style={{ top: "8px" }}
                >
                  {comment.main_heading}
                </span>
                <span className=" text-[#777] font-[400] text-[0.55 rem] ml-2  p-2">
                  • by {comment.meain_heading_by}
                </span>
              </div>

              {show && (
                <>
                  <div className="cmtdata">
                        <div className="py-1 px-0" key={comment.id}>
                          <span className="font-[700] text-[#8c1b13] text-[0.75rem] block">
                            {comment.title}
                          </span>
                          <span className="cmt-text leading-[1.125rem] mb-1">
                            <p className="text-[0.75rem] break-words ">
                              {comment.text}
                            </p>
                          </span>
                        </div>
                  </div>
                    <div className="float-right">
                      <span className="text-[0.75rem] text-gray-600">Add:</span>
                      <span className="box-content text-white bg-[#4d8093] text-[0.55 rem] border-solid ml-2 md:font-bold p-2 pt-0 rounded">
                        <a href="" className="text-[0.75rem]">
                          public comment
                        </a>
                      </span>
                    </div>
                </>
              )}
            </div>
          </div>

          <div className="subCom">
            {repliesData.map((comment, j) => {
                <Comments comment={comment}/>
              })
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Comments;
