import React from 'react';
import Like from '../../interactions/Like';
import Share from '../../interactions/Share';
import style from '../../../../app/Style';

export default function Header({ contents }) {
    return (
        <div className={style.mdcontentHeader.container}>
            {contents.WriteUpImage && (
                <div className={style.mdcontentHeader.imgcontainer}>
                    <img
                        src={contents.WriteUpImage}
                        alt={contents.MachineName}
                        className={style.mdcontentHeader.img}
                    />
                </div>
            )}

            <div className={style.mdcontentHeader.textcontainer}>
                <h1 className={style.mdcontentHeader.h1}>
                    {contents.MachineName}
                </h1>

                <div className={`${style.mdcontentHeader.belowh1} `}>
                    <p><strong>OS:</strong> {contents.OsType}</p>
                    <p><strong>Difficulty:</strong> {contents.Difficulty}</p>
                    <p><strong>Platform:</strong> {contents.Platform}</p>
                    <p><strong>Box IP:</strong> {contents.IPAddress}</p>
                    <p><strong>Box Creator:</strong> {contents.BoxCreator}</p>
                    <p><strong>WriteUp Author:</strong> {contents.Contributors}</p>
                    <p><strong>Box Released:</strong> {new Date(contents.ReleaseDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}</p>
                    <p><strong>Tools:</strong> {contents.ToolsUsed}</p>
                    <p><strong>WriteUp Updated:</strong> {new Date(contents.DateModified).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}</p>
                    {contents.Reference && (
                        <p className="col-span-2">
                            <strong>Reference:</strong>{' '}
                            <a
                                href={contents.Reference}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lime-400 underline"
                            >
                                {contents.Reference}
                            </a>
                        </p>
                    )}
                </div>
                <div className="flex items-center space-x-4 mt-4">
                    <Like
                        contentType="Writeup"
                        contentId={contents.WriteUpID}
                        initialLikes={contents.TotalLikes}
                        HasLiked={Boolean(contents.HasLiked)}
                    />
                    <Share />
                </div>
            </div>
        </div>
    );
}
