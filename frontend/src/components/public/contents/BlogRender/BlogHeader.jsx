import React from 'react';
import Like from '../../interactions/Like';
import Share from '../../interactions/Share';
import style from '../../../../app/Style';

export default function Header({ contents }) {
    return (
        <div className={style.mdcontentHeader.container}>
            <div className={style.mdcontentHeader.imgcontainer}>
                <img
                    src={contents.BlogImage}
                    alt={contents.Title}
                    className={style.mdcontentHeader.img}
                />
            </div>
            <div className={style.mdcontentHeader.textcontainer}>
                <h1 className={style.mdcontentHeader.h1}>{contents.Title}</h1>
                <div className={style.mdcontentHeader.belowh1}>
                    <p>
                        Last Updated:{" "}
                        {new Date(contents.LastUpdated).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </p>
                    <Like contentType={"Blog"} contentId={contents.BlogID} slug={contents.Slug} initialLikes={contents.TotalLikes}/>
                    <Share />
                </div>
            </div>
        </div>
    );
}

