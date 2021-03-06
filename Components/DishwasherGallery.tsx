import React, {FunctionComponent, useEffect, useState} from 'react';
import Image from 'next/image'
import {Session} from "next-auth";

interface OwnProps {
    loading: boolean,
    session: Session | null,
    reloadLeaderboard: () => void
}

type Props = OwnProps;


const DishwasherGallery: FunctionComponent<Props> = (props) => {

    const imageDivClass = "mx-12 filter drop-shadow-lg"
    const imageClass = "rounded"
    const textClass = "text-center text-2xl my-5 filter drop-shadow-none"


    const [state, setState] = useState({
        busy: false,
        new_time: "",
    });

    const checkWasherStatus = () => {
        if (props.session) {
            fetch('/api/db', {
                method: "PUT",
                body: JSON.stringify({action: "?getStatus"})
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((time) => {
                        if(time) {
                            const date = new Date(time)
                            setState({
                                ...state,
                                new_time: date.toLocaleTimeString('nl-NL', {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: false
                                }),
                                busy: time !== 0
                            });
                        }
                    })
                }
            })
        }
    };

    useEffect(() => {
        checkWasherStatus();
    }, [])

    return (
        <div className={"my-8"}>
            <h1 className={"text-3xl text-center mb-8 "}>How to start a wash</h1>
            <div className={"flex justify-center"}>
                <div className={"grid xl:grid-cols-4 md:grid-cols-2 mx-12 w-10/12 self-center overflow-hidden"}>
                    <div className={imageDivClass}>
                        <Image className={imageClass} src={"/Dishwasher/1.jpg"} alt={"First dishwasher picture"}
                               width={150} height={150} layout={"responsive"}/>
                        <p className={textClass}> Step 1</p>
                    </div>
                    <div className={imageDivClass}>
                        <Image className={imageClass} src={"/Dishwasher/2.jpg"} alt={"First dishwasher picture"}
                               width={150} height={150} layout={"responsive"}/>
                        <p className={textClass}> Step 2</p>
                    </div>
                    <div className={imageDivClass}>
                        <Image className={imageClass} src={"/Dishwasher/3.jpg"} alt={"First dishwasher picture"}
                               width={150} height={150} layout={"responsive"}/>
                        <p className={textClass}> Step 3</p>
                    </div>
                    <div className={imageDivClass}>
                        <div className={" aspect-w-7 aspect-h-7"}>
                            <button className={"bg-primary text-white hover:bg-pink-500 " + imageClass} onClick={() => {
                                fetch('/api/db', {
                                    method: "PUT",
                                    body: JSON.stringify({action: "?addWash"})
                                }).then((response) => {
                                    if (response.status === 425) {
                                        checkWasherStatus();
                                    } else {
                                        setState({...state, busy: false});
                                    }
                                    props.reloadLeaderboard();
                                })
                            }}>
                                <p className={"text-xl"}>Clean out the dishwasher</p>
                                {!props.session &&
                                    <p className={"text-xl mt-2"}>(Please login first)</p>
                                }
                                {state.busy &&
                                    <>
                                        <p>The dishwasher is now busy</p>
                                        <p>Please check it at {state.new_time}</p>
                                    </>
                                }
                            </button>
                        </div>
                        <p className={textClass}> Step 4</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DishwasherGallery;
