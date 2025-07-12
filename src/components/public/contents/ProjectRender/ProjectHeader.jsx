import React from 'react';
import Like from '../../interactions/Like';
//import Share from '../../interactions/Share';
import style from '../../../../app/Style';

export default function ProjectsHeader({ contents }) {
    return (
        <div className="space-y-6">
            <h1 className={style.mdcontentHeader.h1}>{contents.Title}</h1>

            {/* Full-width Cover Image */}
            <div className="w-full">
                <img
                    src={contents.CoverImage}
                    alt={contents.Title}
                    className="rounded-xl w-full object-cover "
                />
            </div>

            {/* Project Info Section */}
            <div className={style.mdcontentHeader.textcontainer}>
                

                {/* Detailed Metadata - Two Columns */}
                <div className={`${style.mdcontentHeader.belowh1}`}>
                    <p><strong>Category:</strong> {contents.CategoryName}</p>
                    <p><strong>Status:</strong> {contents.Status || "In Progress"}</p>
                    <p><strong>Start Date:</strong> {new Date(contents.StartDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}</p>
                    <p><strong>End Date:</strong> {contents.EndDate ? new Date(contents.EndDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        }) : "Ongoing"}</p>
                    <p><strong>Progress:</strong> {contents.ProgressPercentage}%</p>
                    <p><strong>Tech Stack:</strong> {contents.TechStacks}</p>
                    <p><strong>Tags:</strong> {contents.Tags}</p>
                    <p><strong>Contributors:</strong> {contents.Contributors}</p>
                    {contents.RepoURL && (
                        <p>
                            <strong>Repository:</strong>{" "}
                            <a
                                href={contents.RepoURL}
                                className="text-lime-400 underline hover:text-lime-300"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                GitHub Repo
                            </a>
                        </p>
                    )}
                    {contents.DemoURL && (
                        <p>
                            <strong>Live Demo:</strong>{" "}
                            <a
                                href={contents.DemoURL}
                                className="text-lime-400 underline hover:text-lime-300"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View Demo
                            </a>
                        </p>
                    )}
                    <div className={style.mdcontentHeader.belowh1}>
                        <Like
                            contentType="Project"
                            contentId={contents.ProjectID}
                            initialLikes={contents.TotalLikes}
                            HasLiked={contents.HasLiked}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
