# ===============================================================================================================
# ================================================== BLOGS QUEIRES ==============================================
# ===============================================================================================================

BLOGS_QUERY = """
SELECT 
    b.BlogID, 
    b.Title, 
    b.Slug, 
    b.Content, 
    b.Summary, 
    b.PublishDate, 
    b.LastUpdated, 
    b.Status, 
    b.BlogImage,
    b.DateCreated,
    b.UploadKey,
    
    GROUP_CONCAT(DISTINCT con.Username) AS Contributors,
    GROUP_CONCAT(DISTINCT con.ContributorID) AS ContributorIDs,

    c.CategoryID, 
    c.Name AS CategoryName,

    GROUP_CONCAT(DISTINCT t.Name) AS Tags,

    COALESCE(l.LikeCount, 0) AS TotalLikes,

    CASE 
        WHEN user_like.ContentID IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS HasLiked

FROM Blogs b

LEFT JOIN BlogParticipantMapping bpm ON b.BlogID = bpm.BlogID
LEFT JOIN Contributor con ON bpm.ContributorID = con.ContributorID
LEFT JOIN Category c ON b.CategoryID = c.CategoryID
LEFT JOIN BlogTag bt ON b.BlogID = bt.BlogID
LEFT JOIN Tag t ON bt.TagID = t.TagID

-- Total likes count per blog
LEFT JOIN (
    SELECT ContentID, COUNT(*) AS LikeCount
    FROM LikeLogs
    WHERE ContentType = 'Blog'
    GROUP BY ContentID
) l ON l.ContentID = b.BlogID

-- Check if this user (by fingerprint) liked the blog
LEFT JOIN (
    SELECT DISTINCT ContentID
    FROM LikeLogs
    WHERE ContentType = 'Blog' AND FingerprintValue = %s
) user_like ON user_like.ContentID = b.BlogID

GROUP BY b.BlogID
ORDER BY b.PublishDate DESC;
-- LIMIT 10;
"""

BLOG_ID_QUERY = """
SELECT BlogID FROM Blogs WHERE Slug = %s ;
"""

BLOG_INSERT_QUERY = """
INSERT INTO Blogs (
    Title,
    Slug,
    Content,
    Summary,
    PublishDate,
    Status,
    CategoryID,
    BlogImage,
    UploadKey
) VALUES (
    %s, %s, %s, %s, %s, %s, %s, %s, %s
) ;
"""

BLOG_UPDATE_QUERY = """
UPDATE Blogs
SET
    Title = %s,
    Content = %s,
    Summary = %s,
    Status = %s,
    CategoryID = %s,
    BlogImage = %s,
    LastUpdated = CURRENT_TIMESTAMP
WHERE BlogID = %s;
"""

BLOG_CONTRIBUTOR_INSERT_QUERY = """
INSERT INTO BlogParticipantMapping (BlogID, ContributorID)
VALUES (%s, %s);
"""

BLOG_CONTRIBUTOR_DELETE_QUERY = 'DELETE FROM BlogParticipantMapping WHERE BlogID = %s;'

BLOG_TAG_INSERT_QUERY = """
INSERT INTO BlogTag (BlogID, TagID)
VALUES (%s, %s);
"""

BLOG_TAG_DELETE_QUERY = 'DELETE FROM BlogTag WHERE BlogID = %s;'

BLOG_SLUG_QUERY = "SELECT Slug FROM Blogs WHERE BlogID = %s;"

BLOG_UPDATE_ON_DELETE_QUERY = """
UPDATE Blogs
SET Status = %s,
    LastUpdated = CURRENT_TIMESTAMP
WHERE BlogID = %s AND Slug = %s;
"""

# ===============================================================================================================
# ================================================== WRITEUP QUEIRES ============================================
# ===============================================================================================================

WRITEUPS_QUERY = """
SELECT 
    w.WriteUpID,
    w.MachineName,
    w.OsType,
    w.Slug,
    w.Difficulty,
    w.Summary,
    w.Content,
    w.IPAddress,
    w.ToolsUsed,
    w.DateCreated,
    w.DateModified,
    w.Reference,
    w.Status,
    w.WriteUpImage,
    w.Platform,
    w.BoxCreator,
    w.ReleaseDate,
    w.UploadKey,

    GROUP_CONCAT(DISTINCT con.Username) AS Contributors,
    GROUP_CONCAT(DISTINCT con.ContributorID) AS ContributorIDs,

    c.CategoryID,
    c.Name AS CategoryName,

    GROUP_CONCAT(DISTINCT t.Name) AS Tags,

    COALESCE(l.LikeCount, 0) AS TotalLikes,

    CASE 
        WHEN user_like.ContentID IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS HasLiked

FROM WriteUp w

LEFT JOIN WriteUpParticipantMapping wpm ON w.WriteUpID = wpm.WriteUpID
LEFT JOIN Contributor con ON wpm.ContributorID = con.ContributorID
LEFT JOIN Category c ON w.CategoryID = c.CategoryID
LEFT JOIN WriteUpTag wt ON w.WriteUpID = wt.WriteUpID
LEFT JOIN Tag t ON wt.TagID = t.TagID

-- Total likes per WriteUp
LEFT JOIN (
    SELECT ContentID, COUNT(*) AS LikeCount
    FROM LikeLogs
    WHERE ContentType = 'WriteUp'
    GROUP BY ContentID
) l ON l.ContentID = w.WriteUpID

-- Check if user (by fingerprint) liked the write-up
LEFT JOIN (
    SELECT DISTINCT ContentID
    FROM LikeLogs
    WHERE ContentType = 'WriteUp' AND FingerprintValue = %s
) user_like ON user_like.ContentID = w.WriteUpID

GROUP BY w.WriteUpID
ORDER BY w.DateCreated DESC;
"""

WRITEUP_SLUG_QUERY  = """
SELECT WriteUpID FROM WriteUp WHERE Slug = %s ;
"""

WRITEUP_UPDATE_ON_DELETE_QUERY = """
UPDATE WriteUp
SET Status = %s,
    LastUpdated = CURRENT_TIMESTAMP
WHERE WriteUpID = %s AND Slug = %s;
"""

WRITEUP_INSERT_QUERY = """
INSERT INTO WriteUp (
    MachineName,
    Difficulty,
    OsType,
    IPAddress,
    Reference,
    Platform,
    ToolsUsed,
    BoxCreator,
    ReleaseDate,
    Content,
    Summary,
    Status,
    CategoryID,
    WriteUpImage,
    UploadKey,
    Slug
) VALUES (
    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
);
"""

WRITEUP_UPDATE_QUERY = """
UPDATE WriteUp
SET
    MachineName = %s,
    Difficulty = %s,
    OsType = %s,
    IPAddress = %s,
    Reference = %s,
    Platform = %s,
    ToolsUsed = %s,
    BoxCreator = %s,
    ReleaseDate = %s,
    Content = %s,
    Summary = %s,
    Status = %s,
    CategoryID = %s,
    WriteUpImage = %s
WHERE
    WriteUpID = %s;
"""


WRITEUP_CONTRIBUTOR_DELETE_QUERY = 'DELETE FROM WriteUpParticipantMapping WHERE WriteUpID = %s;'

WRITEUP_CONTRIBUTOR_INSERT_QUERY = """
INSERT INTO WriteUpParticipantMapping (WriteUpID, ContributorID)
VALUES (%s, %s);
"""

WRITEUP_TAG_INSERT_QUERY = """
INSERT INTO WriteUpTag (WriteUpID, TagID)
VALUES (%s, %s);
"""

WRITEUP_TAG_DELETE_QUERY = 'DELETE FROM WriteUpTag WHERE WriteUpID = %s;'

WRITEUP_SLUG_QUERY = "SELECT Slug FROM WriteUp WHERE WriteUpID = %s;"

WRITEUP_UPDATE_ON_DELETE_QUERY = """
UPDATE WriteUp
SET Status = %s
WHERE WriteUpID = %s AND Slug = %s;
"""


# ===============================================================================================================
# ================================================== PROJECTS QUEIRES ===========================================
# ===============================================================================================================

PROJECTS_QUERY = """
SELECT 
    p.ProjectID, 
    p.Title, 
    p.Slug,
    p.Content,
    p.Description, 
    p.StartDate, 
    p.EndDate, 
    p.Status, 
    p.RepoURL, 
    p.DemoURL, 
    p.ProgressPercentage,
    p.ProgressStatus, 
    p.CoverImage,
    p.DateCreated,
    p.UploadKey,

    c.CategoryID, 
    c.Name AS CategoryName,

    GROUP_CONCAT(DISTINCT con.ContributorID) AS ContributorIDs,
    GROUP_CONCAT(DISTINCT con.Username) AS Contributors,

    GROUP_CONCAT(DISTINCT t.Name) AS Tags,
    GROUP_CONCAT(DISTINCT ts.Name) AS TechStacks,

    COALESCE(l.LikeCount, 0) AS TotalLikes,

    CASE 
        WHEN user_like.ContentID IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS HasLiked

FROM Projects p

LEFT JOIN Category c ON p.CategoryID = c.CategoryID

LEFT JOIN ProjectParticipantMapping ppm ON p.ProjectID = ppm.ProjectID
LEFT JOIN Contributor con ON ppm.ContributorID = con.ContributorID

LEFT JOIN ProjectTag pt ON p.ProjectID = pt.ProjectID
LEFT JOIN Tag t ON pt.TagID = t.TagID

LEFT JOIN ProjectTechStack pts ON p.ProjectID = pts.ProjectID
LEFT JOIN TechStack ts ON pts.TechStackID = ts.TechStackID

-- Total likes per project
LEFT JOIN (
    SELECT ContentID, COUNT(*) AS LikeCount
    FROM LikeLogs
    WHERE ContentType = 'Project'
    GROUP BY ContentID
) l ON l.ContentID = p.ProjectID

-- Whether this fingerprint has liked the project
LEFT JOIN (
    SELECT DISTINCT ContentID
    FROM LikeLogs
    WHERE ContentType = 'Project' AND FingerprintValue = %s
) user_like ON user_like.ContentID = p.ProjectID

GROUP BY p.ProjectID
ORDER BY p.DateCreated DESC;
"""

PROJECT_SLUG_QUERY = """
SELECT ProjectID FROM Projects WHERE Slug = %s ;
"""

PROJECT_UPDATE_ON_DELETE_QUERY = """
UPDATE Projects
SET Status = %s
WHERE ProjectID = %s AND Slug = %s;
"""

PROJECT_INSERT_QUERY = """
INSERT INTO Projects (
    Title,
    Slug,
    Content,
    Description,
    StartDate,
    EndDate,
    Status,
    RepoURL,
    DemoURL,
    CategoryID,
    ProgressPercentage,
    ProgressStatus,
    CoverImage,
    UploadKey
) VALUES (
    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
);
"""

PROJECT_UPDATE_QUERY = """
UPDATE Projects
SET
    Title = %s,
    Content = %s,
    Description = %s,
    StartDate = %s,
    EndDate = %s,
    Status = %s,
    RepoURL = %s,
    DemoURL = %s,
    CategoryID = %s,
    ProgressPercentage = %s,
    ProgressStatus = %s,
    CoverImage = %s
WHERE
    ProjectID = %s;
"""

PROJECT_PARTICIPANT_DELETE_QUERY = """
DELETE FROM ProjectParticipantMapping WHERE ProjectID = %s;
"""

PROJECT_PARTICIPANT_INSERT_QUERY = """
INSERT INTO ProjectParticipantMapping (ProjectID, ContributorID)
VALUES (%s, %s);
"""

PROJECT_TAG_DELETE_QUERY = """
DELETE FROM ProjectTag WHERE ProjectID = %s;
"""

PROJECT_TAG_INSERT_QUERY = """
INSERT INTO ProjectTag (ProjectID, TagID)
VALUES (%s, %s);
"""

PROJECT_TECHSTACK_DELETE_QUERY = """
DELETE FROM ProjectTechStack WHERE ProjectID = %s;
"""

PROJECT_TECHSTACK_INSERT_QUERY = """
INSERT INTO ProjectTechStack (ProjectID, TechStackID)
VALUES (%s, %s);
"""

PROJECT_GET_SLUG_BY_ID_QUERY = """
SELECT Slug FROM Projects WHERE ProjectID = %s;
"""



# ===============================================================================================================
# ================================================== PODCASTS QUEIRES ===========================================
# ===============================================================================================================


PODCAST_QUERY = """
SELECT 
    p.PodcastID,
    p.Title,
    p.Slug,
    p.Description,
    p.Content,
    p.CoverImage,
    p.Duration,
    p.EpisodeNumber,
    p.AudioURL,
    p.DatePublished,
    p.Status,
    p.DateCreated,
    p.UploadKey,
    
    c.CategoryID,
    c.Name AS CategoryName,

    GROUP_CONCAT(DISTINCT con.ContributorID) AS ContributorIDs,
    GROUP_CONCAT(DISTINCT con.Username) AS Contributors,
    GROUP_CONCAT(DISTINCT con.Bio) AS ContributorBios,
    GROUP_CONCAT(DISTINCT con.ProfilePicture) AS ContributorProfiles,

    COALESCE(l.LikeCount, 0) AS TotalLikes,

    CASE 
        WHEN user_like.ContentID IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS HasLiked

FROM Podcast p

LEFT JOIN Category c ON p.CategoryID = c.CategoryID
LEFT JOIN PodcastSpeakerMapping psm ON p.PodcastID = psm.PodcastID
LEFT JOIN Contributor con ON psm.ContributorID = con.ContributorID

-- Like count per podcast
LEFT JOIN (
    SELECT ContentID, COUNT(*) AS LikeCount
    FROM LikeLogs
    WHERE ContentType = 'Podcast'
    GROUP BY ContentID
) l ON l.ContentID = p.PodcastID

-- Check if this user (by fingerprint) liked the podcast
LEFT JOIN (
    SELECT DISTINCT ContentID
    FROM LikeLogs
    WHERE ContentType = 'Podcast' AND FingerprintValue = %s
) user_like ON user_like.ContentID = p.PodcastID

GROUP BY p.PodcastID
ORDER BY p.DatePublished DESC;
-- LIMIT 50;
"""

PODCAST_SLUG_QUERY = """
SELECT PodcastID FROM Podcast WHERE Slug = %s;
"""

PODCAST_UPDATE_ON_DELETE_QUERY = """
UPDATE Podcast
SET Status = %s
WHERE PodcastID = %s AND Slug = %s;
"""

PODCAST_INSERT_QUERY = """
INSERT INTO Podcast (
    Title,
    Slug,
    Description,
    Content,
    CoverImage,
    Duration,
    EpisodeNumber,
    AudioURL,
    CategoryID,
    Status,
    UploadKey
) VALUES (
    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
);
"""

PODCAST_UPDATE_QUERY = """
UPDATE Podcast
SET
    Title = %s,
    Description = %s,
    Content = %s,
    CoverImage = %s,
    Duration = %s,
    EpisodeNumber = %s,
    AudioURL = %s,
    CategoryID = %s,
    Status = %s
WHERE PodcastID = %s;
"""

PODCAST_SPEAKER_DELETE_QUERY = """
DELETE FROM PodcastSpeakerMapping WHERE PodcastID = %s;
"""

PODCAST_SPEAKER_INSERT_QUERY = """
INSERT INTO PodcastSpeakerMapping (PodcastID, ContributorID)
VALUES (%s, %s);
"""

PODCAST_GET_SLUG_BY_ID_QUERY = """
SELECT Slug FROM Podcast WHERE PodcastID = %s;
"""




# ===============================================================================================================
# ================================================== ACHIEVEMENTS QUEIRES =======================================
# ===============================================================================================================


ACHIEVEMENTS_QUERY = """
SELECT 
    a.AchievementID,
    a.Title,
    a.Description,
    a.DateAchieved,
    a.Image,
    a.ReferenceURL,
    a.DateCreated,
    a.UploadKey,
    a.Status,
    
    COALESCE(l.LikeCount, 0) AS TotalLikes,

    CASE 
        WHEN user_like.ContentID IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS HasLiked

FROM Achievements a

-- Total likes per achievement
LEFT JOIN (
    SELECT ContentID, COUNT(*) AS LikeCount
    FROM LikeLogs
    WHERE ContentType = 'Achievement'
    GROUP BY ContentID
) l ON l.ContentID = a.AchievementID

-- Check if this visitor has liked it
LEFT JOIN (
    SELECT DISTINCT ContentID
    FROM LikeLogs
    WHERE ContentType = 'Achievement' AND FingerprintValue = %s
) user_like ON user_like.ContentID = a.AchievementID

ORDER BY a.DateCreated DESC;
-- LIMIT 50;
"""

ACHIEVEMENT_INSERT_QUERY = """
INSERT INTO Achievements (
    Title,
    Description,
    DateAchieved,
    Image,
    UploadKey,
    ReferenceURL,
    Status
) VALUES (
    %s, %s, %s, %s, %s, %s, %s
);
"""

ACHIEVEMENT_UPDATE_QUERY = """
UPDATE Achievements
SET
    Title = %s,
    Description = %s,
    DateAchieved = %s,
    Image = %s,
    ReferenceURL = %s,
    Status = %s
WHERE AchievementID = %s;
"""

ACHIEVEMENT_UPDATE_ON_DELETE_QUERY = """
UPDATE Achievements
SET Status = %s
WHERE AchievementID = %s;
"""




# ===============================================================================================================
# ================================================== CONTRIBUTOR QUEIRES ========================================
# ===============================================================================================================

CONTRIBUTOR_QUERY = """
SELECT 
    c.ContributorID,
    c.Username,
    c.FullName,
    c.Bio,
    c.ProfilePicture,
    c.Type,
    c.UploadKey,
    sl.Platform,
    sl.URL
FROM Contributor c
LEFT JOIN SocialLink sl ON sl.OwnerType = 'Contributor' AND sl.OwnerID = c.ContributorID
WHERE c.Username = %s;
"""


FETCH_ALL_CONTRIBUTOR_QUERY = """
SELECT 
    c.ContributorID,
    c.Username,
    c.FullName,
    c.Bio,
    c.ProfilePicture,
    c.Type,
    c.UploadKey,
    sl.Platform,
    sl.URL
FROM Contributor c
LEFT JOIN SocialLink sl ON sl.OwnerType = 'Contributor' AND sl.OwnerID = c.ContributorID
"""

CHECK_CONTRIBUTOR_TYPE_QUERY = """
SELECT Type 
FROM Contributor 
WHERE Username = %s;
"""

CONTRIBUTOR_INSERT_QUERY = """
INSERT INTO Contributor (
    Username,
    FullName,
    Bio,
    ProfilePicture,
    Type,
    UploadKey
) VALUES (
    %s, %s, %s, %s, %s, %s
);
"""

CONTRIBUTOR_UPDATE_QUERY = """
UPDATE Contributor
SET
    Username = %s,
    FullName = %s,
    Bio = %s,
    ProfilePicture = %s,
    Type = %s
WHERE ContributorID = %s;
"""


CONTRIBUTOR_ID_QUERY = """
SELECT ContributorID FROM Contributor WHERE Username = %s ;
"""


# ===============================================================================================================
# ================================================== EVENTS QUEIRES =============================================
# ===============================================================================================================


EVENTS_QUERY = """
SELECT 
    e.EventID,
    e.Title,
    e.Description,
    e.StartDate,
    e.EndDate,
    e.Location,
    e.EventType,
    e.Status,
    e.EventImage,
    e.DateCreated,
    e.UploadKey,

    -- Organizer Info
    eo.OrganizerID,
    eo.Name AS OrganizerName,
    eo.Email AS OrganizerEmail,
    eo.ContactNumber AS OrganizerContact,
    eo.Organization AS OrganizerOrganization,
    eo.ProfilePicture AS OrganizerProfilePicture,

    -- Tags
    GROUP_CONCAT(DISTINCT t.TagID) AS TagIDs,
    GROUP_CONCAT(DISTINCT t.Name) AS TagNames

FROM `Event` e

JOIN EventOrganizer eo ON eo.OrganizerID = e.OrganizerID
LEFT JOIN EventTag et ON e.EventID = et.EventID
LEFT JOIN Tag t ON et.TagID = t.TagID

GROUP BY e.EventID
ORDER BY e.DateCreated DESC
-- LIMIT 10;
"""


# ===============================================================================================================
# ================================================== DASHBOARD QUEIRES ==========================================
# ===============================================================================================================

LATEST_CONTENT_QUERY = """
SELECT 
    lc.LatestContentID,
    lc.ContentType,
    lc.ContentID,
    COALESCE(b.Title, w.MachineName, p.Title, pr.Title, a.Title, e.Title) AS Title,
    COALESCE(b.BlogImage, w.WriteUpImage, p.CoverImage, pr.CoverImage, a.Image, e.EventImage) AS Image,
    COALESCE(b.Summary, w.Summary, p.Description, pr.Description, a.Description, e.Description) AS Description,
    COALESCE(b.DateCreated, w.DateCreated, p.DateCreated, pr.DateCreated, a.DateCreated, e.DateCreated) AS DateCreated
FROM LatestContent lc

-- BLOG
LEFT JOIN Blogs b ON lc.ContentType = 'Blog' AND lc.ContentID = b.BlogID

-- WRITEUP
LEFT JOIN WriteUp w ON lc.ContentType = 'WriteUp' AND lc.ContentID = w.WriteUpID

-- PODCAST
LEFT JOIN Podcast p ON lc.ContentType = 'Podcast' AND lc.ContentID = p.PodcastID

-- PROJECT
LEFT JOIN Projects pr ON lc.ContentType = 'Project' AND lc.ContentID = pr.ProjectID

-- ACHIEVEMENT
LEFT JOIN Achievements a ON lc.ContentType = 'Achievement' AND lc.ContentID = a.AchievementID

-- EVENT
LEFT JOIN Event e ON lc.ContentType = 'Event' AND lc.ContentID = e.EventID

-- Only latest one per content type
WHERE (lc.LatestContentID, lc.ContentType) IN (
    SELECT 
        MAX(LatestContentID), ContentType
    FROM LatestContent
    GROUP BY ContentType
)

ORDER BY DateCreated DESC
LIMIT 6;

"""

ANALYTICS_QUERY = """
    SELECT 
        'Blogs' AS Label,
        (SELECT COUNT(*) FROM Blogs) AS Total,
        COALESCE((SELECT COUNT(*) FROM LikeLogs WHERE ContentType = 'Blog'), 0) AS Likes
    UNION
    SELECT 
        'Writeups' AS Label,
        (SELECT COUNT(*) FROM WriteUp) AS Total,
        COALESCE((SELECT COUNT(*) FROM LikeLogs WHERE ContentType = 'WriteUp'), 0) AS Likes
    UNION
    SELECT 
        'Projects' AS Label,
        (SELECT COUNT(*) FROM Projects) AS Total,
        COALESCE((SELECT COUNT(*) FROM LikeLogs WHERE ContentType = 'Project'), 0) AS Likes
    UNION
    SELECT 
        'Achievements' AS Label,
        (SELECT COUNT(*) FROM Achievements) AS Total,
        COALESCE((SELECT COUNT(*) FROM LikeLogs WHERE ContentType = 'Achievement'), 0) AS Likes;
"""


"""
TO INCLUDE IN ANAYTICS LATER
    
    SELECT 
        'Podcasts' AS Label,
        (SELECT COUNT(*) FROM Podcast) AS Total,
        COALESCE((SELECT COUNT(*) FROM LikeLogs WHERE ContentType = 'Podcast'), 0) AS Likes
    UNION
"""

TOTAL_VISITOR_QUERY = """
SELECT
  COUNT(DISTINCT FingerprintValue) AS total_visitors,
  
  -- Visitors in the last 30 days (now → 30 days ago)
  COUNT(DISTINCT CASE 
    WHEN FirstVisit >= CURRENT_DATE - INTERVAL 30 DAY 
  THEN FingerprintValue END) AS last_30_days,

  -- Visitors between 30→60 days ago (exclusive of last 30 days)
  COUNT(DISTINCT CASE 
    WHEN FirstVisit >= CURRENT_DATE - INTERVAL 60 DAY 
      AND FirstVisit < CURRENT_DATE - INTERVAL 30 DAY 
  THEN FingerprintValue END) AS last_30_60_days

FROM Visitor;
"""

TOP_LIKE_QUERY = """
SELECT 
  ll.ContentType,
  ll.ContentID,
  COUNT(*) AS LikeCount,

  COALESCE(b.Title, w.MachineName, p.Title, pr.Title, a.Title, e.Title) AS Title,
  COALESCE(b.Slug, w.Slug, p.Slug, pr.Slug, NULL) AS Slug,
  COALESCE(b.BlogImage, w.WriteUpImage, p.CoverImage, pr.CoverImage, a.Image, e.EventImage) AS Image

FROM LikeLogs ll

-- BLOG
LEFT JOIN Blogs b 
  ON ll.ContentType = 'Blog' AND ll.ContentID = b.BlogID AND b.Status = 'Published'

-- WRITEUP
LEFT JOIN WriteUp w 
  ON ll.ContentType = 'WriteUp' AND ll.ContentID = w.WriteUpID AND w.Status = 'Published'

-- PODCAST
LEFT JOIN Podcast p 
  ON ll.ContentType = 'Podcast' AND ll.ContentID = p.PodcastID AND p.Status = 'Published'

-- PROJECT
LEFT JOIN Projects pr 
  ON ll.ContentType = 'Project' AND ll.ContentID = pr.ProjectID AND pr.Status = 'Published'

-- ACHIEVEMENT
LEFT JOIN Achievements a 
  ON ll.ContentType = 'Achievement' AND ll.ContentID = a.AchievementID

-- EVENT
LEFT JOIN Event e 
  ON ll.ContentType = 'Event' AND ll.ContentID = e.EventID AND e.Status = 'Published'

GROUP BY ll.ContentType, ll.ContentID
ORDER BY LikeCount DESC
LIMIT 5;
"""


LIKES_BY_1_YEAR = """
SELECT
  DATE_FORMAT(DateCreated, '%%Y-%%m') AS date,
  COUNT(*) AS total_likes
FROM LikeLogs
WHERE DateCreated >= CURDATE() - INTERVAL 11 MONTH
GROUP BY DATE_FORMAT(DateCreated, '%%Y-%%m')
ORDER BY date ASC;
"""

LIKES_BY_1_MONTH = """
SELECT
  DAY(DateCreated) AS date,
  COUNT(*) AS total_likes
FROM LikeLogs
WHERE DateCreated >= CURDATE() - INTERVAL 1 MONTH
GROUP BY DAY(DateCreated)
ORDER BY date ASC;
"""

LIKES_BY_1_WEEK = """
SELECT
  DATE_FORMAT(DateCreated, '%%a') AS date,
  COUNT(*) AS total_likes
FROM LikeLogs
WHERE DateCreated >= CURDATE() - INTERVAL 7 DAY
GROUP BY DATE(DateCreated)
ORDER BY DateCreated ASC;
"""

VISITORS_BY_1_MONTH = """
SELECT
  DAY(LastVisit) AS date,
  COUNT(*) AS total_visitors
FROM Visitor
WHERE LastVisit >= CURDATE() - INTERVAL 1 MONTH
GROUP BY DAY(LastVisit)
ORDER BY date ASC;
"""

VISITORS_BY_1_YEAR = """
SELECT
  DATE_FORMAT(LastVisit, '%%Y-%%m') AS date,
  COUNT(*) AS total_visitors
FROM Visitor
WHERE LastVisit >= CURDATE() - INTERVAL 11 MONTH
GROUP BY DATE_FORMAT(LastVisit, '%%Y-%%m')
ORDER BY date ASC;
"""

VISITORS_BY_1_WEEK = """
SELECT
  DATE_FORMAT(LastVisit, '%%a') AS date,
  COUNT(*) AS total_visitors
FROM Visitor
WHERE LastVisit >= CURDATE() - INTERVAL 7 DAY
GROUP BY DATE(LastVisit)
ORDER BY LastVisit ASC;
"""

CATEGORY_FETCH_ALL_QUERY = """
SELECT CategoryID, Name, Description
FROM Category
ORDER BY Name ASC;
"""

CATEGORY_FETCH_QUERY = """
SELECT CategoryID, Name, Description FROM Category WHERE Name = %s;
"""

CATEGORY_INSERT_QUERY = """
INSERT INTO Category (Name, Description)
VALUES (%s, %s);
"""

TAG_FETCH_ALL_QUERY = """
SELECT TagID, Name
FROM Tag
ORDER BY Name ASC;
"""

TAG_FETCH_QUERY = """
SELECT TagID, Name FROM Tag WHERE Name = %s; 
"""

TAG_INSERT_QUERY = """
INSERT INTO Tag (Name)
VALUES (%s);
"""

TECHSTACK_FETCH_ALL_QUERY = """
SELECT TechStackID, Name, Description
FROM TechStack
ORDER BY Name ASC;
"""
TECHSTACK_FETCH_QUERY = """
SELECT TechStackID, Name, Description FROM TechStack WHERE Name = %s ;
"""

TECHSTACK_INSERT_QUERY = """
INSERT INTO TechStack (Name, Description)
VALUES (%s, %s);
"""


# ===============================================================================================================
# ================================================== VISITORS QUEIRES ===========================================
# ===============================================================================================================

VISITOR_FINGERPRINT_QUERY = """
    SELECT * FROM Visitor WHERE FingerprintValue = %s
"""

UPDATE_VISITOR_QUERY = """
    UPDATE Visitor
    SET LastVisit = %s,
        VisitCount = %s,
        IsActive = %s
    WHERE FingerprintValue = %s
"""

INSERT_VISITOR_QUERY = """
    INSERT INTO Visitor (
        FingerprintValue, IPAddress, Location, Browser, OS, DeviceType,
        FirstVisit, LastVisit, VisitCount, IsActive
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

# ===============================================================================================================
# ================================================== LIKES QUEIRES ==============================================
# ===============================================================================================================


CHECK_LIKELOG_QUERY = """
    SELECT 1 FROM LikeLogs
    WHERE ContentType = %s AND ContentID = %s AND FingerprintValue = %s
    LIMIT 1;
"""

INSERT_LIKELOG_QUERY = """
    INSERT INTO LikeLogs (ContentType, ContentID, FingerprintValue, DateCreated)
    VALUES (%s, %s, %s, NOW());
"""


# ===============================================================================================================
# ================================================== TEAM QUEIRES ===============================================
# ===============================================================================================================

TEAM_MEMBER_QUERY = """
SELECT 
    tm.TeamMemberID,
    tm.Username,
    tm.FullName,
    tm.Bio,
    tm.ProfilePicture,
    tm.Email,
    tm.DateAdded,
    tm.AddedBy,
    tm.Status,
    tm.LastUpdated,
    tm.Role,
    tm.UploadKey,
    sl.Platform,
    sl.URL
FROM TeamMember tm
LEFT JOIN SocialLink sl ON sl.OwnerType = 'TeamMember' AND sl.OwnerID = tm.TeamMemberID
WHERE tm.Username = %s;
"""

USER_LOGIN_QUERY = "SELECT * FROM Login WHERE Username = %s ;"
LAST_LOGIN_UPDATE = "UPDATE Login SET LastLogin = %s WHERE LoginID = %s"

MEMBER_ROLE_QUERY = "SELECT Role FROM TeamMember WHERE Username = %s"

FETCH_ALL_TEAM_MEMBERS_QUERY = """
SELECT 
    tm.TeamMemberID,
    tm.Username,
    tm.FullName,
    tm.Bio,
    tm.ProfilePicture,
    tm.Email,
    tm.DateAdded,
    tm.AddedBy,
    tm.Status,
    tm.LastUpdated,
    tm.Role,
    tm.UploadKey,
    sl.Platform,
    sl.URL
FROM TeamMember tm
LEFT JOIN SocialLink sl ON sl.OwnerType = 'TeamMember' AND sl.OwnerID = tm.TeamMemberID;
"""

TEAM_MEMBER_ID_QUERY = "SELECT TeamMemberID FROM TeamMember WHERE Username = %s;"

TEAM_MEMBER_INSERT_QUERY = """
INSERT INTO TeamMember (
    Username,
    FullName,
    Bio,
    ProfilePicture,
    Email,
    AddedBy,
    Status,
    Role,
    UploadKey
) VALUES (
    %s, %s, %s, %s, %s, %s, %s, %s, %s
);
"""

TEAM_MEMBER_UPDATE_QUERY = """
UPDATE TeamMember
SET
    Username = %s,
    FullName = %s,
    Bio = %s,
    ProfilePicture = %s,
    Email = %s,
    Role = %s
WHERE TeamMemberID = %s;
"""

TEAM_MEMBER_STATUS_UPDATE_QUERY = """
UPDATE TeamMember
SET Status = %s
WHERE TeamMemberID = %s;
"""


# ===============================================================================================================
# ================================================== ABOUT-TEAM QUEIRES =========================================
# ===============================================================================================================

ABOUT_TEAM_FETCH_SECTION_QUERY = """
SELECT ContentID, Title, Description, SectionName FROM AboutTeamContent
WHERE SectionName = %s
LIMIT 1;
"""


ABOUT_TEAM_INSERT_QUERY = """
INSERT INTO AboutTeamContent (
    Title,
    Description,
    SectionName
) VALUES (
    %s, %s, %s
);
"""


ABOUT_TEAM_UPDATE_QUERY = """
UPDATE AboutTeamContent
SET Title = %s,
    Description = %s
WHERE SectionName = %s;
"""








# ===============================================================================================================
# ================================================== OTHER GENERAL QUEIRES ======================================
# ===============================================================================================================

INSERT_SOCIAL_LINK_QUERY = """
INSERT INTO SocialLink (
    OwnerType,
    OwnerID,
    Platform,
    URL
) VALUES (
    %s, %s, %s, %s
);
"""


SOCIALLINK_UPDATE_QUERY = """
UPDATE SocialLink
SET Platform = %s,
    URL = %s
WHERE SocialLinkID = %s AND OwnerType = %s;
"""




DELETEBIN_INSERT_QUERY = """
INSERT INTO DeletedBin (
    ContentType,
    ContentID,
    DeletedDate,
    DeletedBy,
    Reason
) VALUES (
    %s, %s, CURRENT_TIMESTAMP, %s, %s
);
"""


DELETE_CONTRIBUTOR_SOCIALS = "DELETE FROM SocialLink WHERE OwnerType = %s AND OwnerID = %s"



