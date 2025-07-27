import os
import pymysql
from dotenv import load_dotenv
from query import *

load_dotenv()

DB_CONFIG = {
    'host': os.getenv('DB_HOST'),
    'user': os.getenv('DB_USERNAME'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'cursorclass': pymysql.cursors.DictCursor
}

ContentTypes = {
            "blog": "blogs",
            "writeup": "writeups",
            "podcast": "podcasts",
            "achievement": "achievements"
}

class Database:
    @staticmethod
    def get_connection():
        return pymysql.connect(**DB_CONFIG)

    @classmethod
    def execute(cls, query, params=None, fetchone=False, fetchall=False, commit=False):
        try:
            with cls.get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(query, params or ())
                    
                    if commit:
                        conn.commit()
                        if query.strip().upper().startswith("INSERT"):
                            return cur.lastrowid
                        return True
                    
                    if fetchone:
                        return cur.fetchone()
                    
                    if fetchall:
                        return cur.fetchall()
                    
                    return True  # Fallback for queries like INSERT with no need to fetch
        except Exception as e:
            print(f"[-] Database Execution Error: {e}")
            return None
    # ============================================================================================
    # =================================== BLOG QUERIES =======================================
    # ============================================================================================
    @classmethod
    def get_blog_id(cls, Slug):
        return cls.execute(BLOG_ID_QUERY, params=(Slug,), fetchone=True)
    
    @classmethod
    def get_blog_slug(cls, BlogID):
        return cls.execute(BLOG_SLUG_QUERY, params=(BlogID,), fetchone=True)
    
    @classmethod
    def get_blogs(cls, fingerprint):
        param = (fingerprint,) if fingerprint else ('__invalid__',)
        return cls.execute(BLOGS_QUERY, params=param, fetchall=True)
        
    @classmethod
    def insert_blogs(cls, Title, Slug, Content, Summary, PublishDate, Status, CategoryID, BlogImage, UploadKey):
        return cls.execute(BLOG_INSERT_QUERY, params=(Title, Slug, Content, Summary, PublishDate, Status, CategoryID, BlogImage, UploadKey), commit=True)
    
    @classmethod
    def update_blogs(cls, BlogID, Title, Content, Summary,  Status, CategoryID, BlogImage):
        return cls.execute(BLOG_UPDATE_QUERY, params=(Title, Content, Summary, Status, CategoryID, BlogImage, BlogID,), commit=True)
        
    @classmethod
    def insert_blogtag(cls, BlogID, TagID):
        cls.execute(BLOG_TAG_INSERT_QUERY, params=(BlogID, TagID), commit=True)
        
    @classmethod
    def delete_blogtag(cls, BlogID):
        cls.execute(BLOG_TAG_DELETE_QUERY, params=(BlogID,), commit=True)
        
    @classmethod
    def insert_blog_contributor(cls, BlogID, ContributorID):
        cls.execute(BLOG_CONTRIBUTOR_INSERT_QUERY, params=(BlogID, ContributorID), commit=True)

    @classmethod
    def delete_blog_contributor(cls, BlogID):
        cls.execute(BLOG_CONTRIBUTOR_DELETE_QUERY, params=(BlogID,), commit=True)
        
    @classmethod
    def delete_blog(cls, BlogID, Slug, Username, reason):
        cls.execute(DELETEBIN_INSERT_QUERY, params=('Blog', BlogID, Username, reason,), commit=True)
        cls.execute(BLOG_UPDATE_ON_DELETE_QUERY, params=('Deleted', BlogID, Slug,) ,commit=True)
        
    # ============================================================================================
    # =================================== WRITEUP QUERIES =======================================
    # ============================================================================================
    @classmethod
    def get_writeups(cls, fingerprint):
        param = (fingerprint,) if fingerprint else ('__invalid__',)
        return cls.execute(WRITEUPS_QUERY, params=param, fetchall=True)
    
    @classmethod
    def update_writeup(cls, WriteUpID, MachineName, Difficulty, OsType, IPAddress, Reference, Platform, ToolsUsed, BoxCreator, ReleaseDate, Content, Summary, Status, CategoryID, WriteUpImage):
        return cls.execute(WRITEUP_UPDATE_QUERY, params=(MachineName, Difficulty, OsType, IPAddress, Reference,  Platform, ToolsUsed, BoxCreator, ReleaseDate, Content, Summary, Status, CategoryID, WriteUpImage, WriteUpID), commit=True)

    @classmethod
    def insert_writeup(cls, MachineName, Difficulty, OsType, IPAddress, Reference, Platform, ToolsUsed, BoxCreator, ReleaseDate, Content, Summary, Status, CategoryID, WriteUpImage, UploadKey, Slug):
        return cls.execute(WRITEUP_INSERT_QUERY, params=(MachineName, Difficulty, OsType, IPAddress, Reference, Platform, ToolsUsed, BoxCreator, ReleaseDate, Content, Summary, Status, CategoryID, WriteUpImage, UploadKey, Slug), commit=True )
    
    @classmethod
    def get_writeup_slug(cls, WriteUpID):
        return cls.execute( WRITEUP_SLUG_QUERY, params=(WriteUpID,), fetchone=True)
    
    @classmethod
    def delete_writeup(cls, WriteUpID, Slug, Username, reason):
        cls.execute(DELETEBIN_INSERT_QUERY, params=('WriteUp', WriteUpID, Username, reason,), commit=True)
        cls.execute(WRITEUP_UPDATE_ON_DELETE_QUERY, params=('Deleted', WriteUpID, Slug,) ,commit=True)
        
    @classmethod
    def delete_writeup_tag(cls, WriteUpID):
        cls.execute(WRITEUP_TAG_DELETE_QUERY, params=(WriteUpID,), commit=True)

    @classmethod
    def insert_writeup_tag(cls, WriteUpID, TagID):
        cls.execute(WRITEUP_TAG_INSERT_QUERY, params=(WriteUpID, TagID), commit=True)

    @classmethod
    def delete_writeup_contributor(cls, WriteUpID):
        cls.execute(WRITEUP_CONTRIBUTOR_DELETE_QUERY, params=(WriteUpID,), commit=True)

    @classmethod
    def insert_writeup_contributor(cls, WriteUpID, ContributorID):
        cls.execute(WRITEUP_CONTRIBUTOR_INSERT_QUERY, params=(WriteUpID, ContributorID), commit=True)


    # ============================================================================================
    # =================================== PROJECTS QUERIES =======================================
    # ============================================================================================

    @classmethod
    def get_projects(cls, fingerprint):
        param = (fingerprint,) if fingerprint else ('__invalid__',)
        return cls.execute(PROJECTS_QUERY, params=param, fetchall=True)

    @classmethod
    def get_project_slug(cls, ProjectID):
        return cls.execute(PROJECT_GET_SLUG_BY_ID_QUERY, params=(ProjectID,), fetchone=True)

    @classmethod
    def insert_project(cls, Title, Slug, Content, Description, StartDate, EndDate, Status, RepoURL, DemoURL, CategoryID, ProgressPercentage, ProgressStatus, CoverImage, UploadKey):
        return cls.execute(PROJECT_INSERT_QUERY, params=(Title, Slug, Content, Description, StartDate, EndDate, Status, RepoURL, DemoURL, CategoryID, ProgressPercentage, ProgressStatus, CoverImage, UploadKey), commit=True)

    @classmethod
    def update_project(cls, ProjectID, Title, Content, Description, StartDate, EndDate, Status, RepoURL, DemoURL, CategoryID, ProgressPercentage, ProgressStatus, CoverImage):
        return cls.execute(PROJECT_UPDATE_QUERY, params=(Title, Content, Description, StartDate, EndDate, Status, RepoURL, DemoURL, CategoryID, ProgressPercentage, ProgressStatus, CoverImage, ProjectID), commit=True)

    @classmethod
    def delete_project(cls, ProjectID, Slug, Username, reason):
        cls.execute(DELETEBIN_INSERT_QUERY, params=('Project', ProjectID, Username, reason,), commit=True)
        cls.execute(PROJECT_UPDATE_ON_DELETE_QUERY, params=('Deleted', ProjectID, Slug,), commit=True)

    @classmethod
    def delete_project_tag(cls, ProjectID):
        cls.execute(PROJECT_TAG_DELETE_QUERY, params=(ProjectID,), commit=True)

    @classmethod
    def insert_project_tag(cls, ProjectID, TagID):
        cls.execute(PROJECT_TAG_INSERT_QUERY, params=(ProjectID, TagID), commit=True)

    @classmethod
    def delete_project_techstack(cls, ProjectID):
        cls.execute(PROJECT_TECHSTACK_DELETE_QUERY, params=(ProjectID,), commit=True)

    @classmethod
    def insert_project_techstack(cls, ProjectID, TechStackID):
        cls.execute(PROJECT_TECHSTACK_INSERT_QUERY, params=(ProjectID, TechStackID), commit=True)

    @classmethod
    def delete_project_contributor(cls, ProjectID):
        cls.execute(PROJECT_PARTICIPANT_DELETE_QUERY, params=(ProjectID,), commit=True)

    @classmethod
    def insert_project_contributor(cls, ProjectID, ContributorID):
        cls.execute(PROJECT_PARTICIPANT_INSERT_QUERY, params=(ProjectID, ContributorID), commit=True)

    
    
    # ============================================================================================
    # =================================== PODCAST QUERIES ========================================
    # ============================================================================================
    @classmethod
    def get_podcasts(cls, fingerprint):
        param = (fingerprint,) if fingerprint else ('__invalid__',)
        return cls.execute(PODCAST_QUERY, params=param, fetchall=True)

    @classmethod
    def get_podcast_slug(cls, PodcastID):
        return cls.execute(PODCAST_GET_SLUG_BY_ID_QUERY, params=(PodcastID,), fetchone=True)

    @classmethod
    def insert_podcast(cls, Title, Slug, Description, Content, CoverImage, Duration, EpisodeNumber, AudioURL, CategoryID, Status, UploadKey):
        return cls.execute(PODCAST_INSERT_QUERY, params=(Title, Slug, Description, Content, CoverImage, Duration, EpisodeNumber, AudioURL, CategoryID, Status, UploadKey), commit=True)

    @classmethod
    def update_podcast(cls, PodcastID, Title, Description, Content, CoverImage, Duration, EpisodeNumber, AudioURL, CategoryID, Status):
        return cls.execute(PODCAST_UPDATE_QUERY, params=(Title, Description, Content, CoverImage, Duration, EpisodeNumber, AudioURL, CategoryID, Status, PodcastID), commit=True)

    @classmethod
    def delete_podcast(cls, PodcastID, Slug, Username, reason):
        cls.execute(DELETEBIN_INSERT_QUERY, params=('Podcast', PodcastID, Username, reason), commit=True)
        cls.execute(PODCAST_UPDATE_ON_DELETE_QUERY, params=('Deleted', PodcastID, Slug), commit=True)

    @classmethod
    def delete_podcast_speakers(cls, PodcastID):
        cls.execute(PODCAST_SPEAKER_DELETE_QUERY, params=(PodcastID,), commit=True)

    @classmethod
    def insert_podcast_speaker(cls, PodcastID, ContributorID):
        cls.execute(PODCAST_SPEAKER_INSERT_QUERY, params=(PodcastID, ContributorID), commit=True)


    # ============================================================================================
    # =================================== ACHIEVEMENTS QUERIES ===================================
    # ============================================================================================
    @classmethod
    def get_achievements(cls, fingerprint):
        param = (fingerprint,) if fingerprint else ('__invalid__',)
        return cls.execute(ACHIEVEMENTS_QUERY, params=param, fetchall=True)

    @classmethod
    def get_achievements(cls, fingerprint):
        param = (fingerprint,) if fingerprint else ('__invalid__',)
        return cls.execute(ACHIEVEMENTS_QUERY, params=param, fetchall=True)

    @classmethod
    def insert_achievement(cls, Title, Description, DateAchieved, Image, UploadKey, ReferenceURL, Status):
        return cls.execute( ACHIEVEMENT_INSERT_QUERY, params=(Title, Description, DateAchieved, Image, UploadKey, ReferenceURL, Status,), commit=True )

    @classmethod
    def update_achievement(cls, AchievementID, Title, Description, DateAchieved, Image, ReferenceURL, Status):
        return cls.execute( ACHIEVEMENT_UPDATE_QUERY, params=(Title, Description, DateAchieved, Image, ReferenceURL, Status, AchievementID,), commit=True )

    @classmethod
    def delete_achievement(cls, AchievementID, Username, reason):
        cls.execute( DELETEBIN_INSERT_QUERY, params=('Achievement', AchievementID, Username, reason), commit=True  )
        cls.execute( ACHIEVEMENT_UPDATE_ON_DELETE_QUERY, params=('Deleted', AchievementID,), commit=True  )



    # ============================================================================================
    # =================================== CONTRIBUTORS QUERIES ===================================
    # ============================================================================================
    
    @classmethod
    def insert_contributor(cls, Username, FullName, Bio, ProfilePicture, Type, UploadKey):
        return cls.execute( CONTRIBUTOR_INSERT_QUERY, params=(Username, FullName, Bio, ProfilePicture, Type, UploadKey,), commit=True )
    
    @classmethod
    def update_contributor(cls, ContributorID, Username, FullName, Bio, ProfilePicture, Type):
        return cls.execute( CONTRIBUTOR_UPDATE_QUERY, params=(Username, FullName, Bio, ProfilePicture, Type, ContributorID,), commit=True )
    
    @classmethod
    def get_contributor_details(cls, username):
        return cls.execute(CONTRIBUTOR_QUERY, params=(username,), fetchall=True)

    @classmethod
    def get_contributor_id(cls, username):
        return cls.execute(CONTRIBUTOR_ID_QUERY, params=(username,), fetchone=True)
        
    @classmethod
    def get_contributor(cls, username):
        ctype = cls.get_contributor_type(username)
        if not ctype:
            return None
            
        if ctype["Type"] == "Member":
            return cls.get_member(username)
        else:
            return cls.get_contributor_details(username)
    
    @classmethod
    def get_all_contributors(cls):
        return cls.execute(FETCH_ALL_CONTRIBUTOR_QUERY, fetchall=True)
        
    @classmethod
    def get_contributor_type(cls, username):
        result = cls.execute(CHECK_CONTRIBUTOR_TYPE_QUERY, params=(username,), fetchall=True)
        return result[0] if result else None


    # ============================================================================================
    # =================================== SOCIAL LINK QUERIES ===================================
    # ============================================================================================        
    @classmethod
    def delete_social_links(cls, OwnerType, OwnerID):
        return cls.execute(DELETE_CONTRIBUTOR_SOCIALS, params=(OwnerType, OwnerID,), commit=True)
        
    @classmethod
    def insert_social_link(cls, OwnerType, OwnerID, Platform, URL):
        return cls.execute(INSERT_SOCIAL_LINK_QUERY, params=(OwnerType, OwnerID, Platform, URL,), commit=True)

     
    # ============================================================================================
    # =================================== TEAM QUERIES ===========================================
    # ============================================================================================  
    
    @classmethod
    def get_member(cls, username):
        return cls.execute(TEAM_MEMBER_QUERY, params=(username,), fetchall=True)

    @classmethod
    def get_member_role(cls, username):
        return cls.execute(MEMBER_ROLE_QUERY, params=(username), fetchone=True)
        
    @classmethod
    def get_all_team_members(cls):
        return cls.execute(FETCH_ALL_TEAM_MEMBERS_QUERY, fetchall=True)

    @classmethod
    def get_member_id(cls, username):
        return cls.execute(TEAM_MEMBER_ID_QUERY, params=(username,), fetchone=True)

    @classmethod
    def insert_team_member(cls, Username, FullName, Bio, ProfilePicture, Email, AddedBy, Status, Role, UploadKey):
        return cls.execute(TEAM_MEMBER_INSERT_QUERY, params=(Username, FullName, Bio, ProfilePicture, Email, AddedBy, Status, Role, UploadKey), commit=True )

    @classmethod
    def update_team_member(cls, Username, FullName, Bio, ProfilePicture, Email, Role, TeamMemberID):
        return cls.execute( TEAM_MEMBER_UPDATE_QUERY, params=(Username, FullName, Bio, ProfilePicture, Email, Role, TeamMemberID),  commit=True )

    @classmethod
    def update_team_member_status(cls, TeamMemberID, Status):
        return cls.execute(TEAM_MEMBER_STATUS_UPDATE_QUERY, params=(Status, TeamMemberID,), commit=True )
    
    
    # ============================================================================================
    # =================================== LOGIN QUERIES ==========================================
    # ============================================================================================  
    
    @classmethod
    def get_user_login(cls, username):
        return cls.execute(USER_LOGIN_QUERY, params=(username,), fetchone=True)
    
    @classmethod
    def update_last_login(cls, memberID, timestamp):
        return cls.execute(LAST_LOGIN_UPDATE, params=(timestamp, memberID), commit=True)
        
    @classmethod
    def create_new_login(cls, username, password_hash, team_member_id):
        return cls.execute(CREATE_NEW_LOGIN_QUERY, params=(username, password_hash, team_member_id), commit=True)

    @classmethod
    def update_password_by_id(cls, login_id, password_hash, is_first_login=False):
        return cls.execute(UPDATE_PASSWORD_QUERY, params=(password_hash, is_first_login, login_id), commit=True)

    @classmethod
    def update_password_by_username(cls, username, password_hash, is_first_login=False):
        return cls.execute(UPDATE_BY_USERNAME_QUERY, params=(password_hash, is_first_login, username), commit=True)


    # ============================================================================================
    # =================================== ABOUT-TEAM QUERIES =====================================
    # ============================================================================================  
    @classmethod
    def about_team_section(cls, section):
        return cls.execute(ABOUT_TEAM_FETCH_SECTION_QUERY, params=(section), fetchone=True)
        
    @classmethod
    def about_team_insert(cls, title, desscription, section):
        return cls.execute(ABOUT_TEAM_INSERT_QUERY, params=(title, desscription, section), commit=True)
        
    @classmethod
    def about_team_update(cls, title, description, section):
        return cls.execute(ABOUT_TEAM_UPDATE_QUERY, params=(title, description, section), commit=True)
    
    
        
    # ============================================================================================
    # =================================== EVENT, LATEST QUERIES ==================================
    # ============================================================================================      
    @classmethod
    def get_events(cls):
        return cls.execute(EVENTS_QUERY, fetchall=True)

    @classmethod
    def get_latest(cls):
        return cls.execute(LATEST_CONTENT_QUERY, fetchall=True)


    # ============================================================================================
    # =================================== VISITOR QUERIES ======================================
    # ============================================================================================   
    
    @classmethod
    def get_visitor_by_fingerprint(cls, fingerprint_value):
        return cls.execute(VISITOR_FINGERPRINT_QUERY, params=(fingerprint_value,), fetchone=True )

    @classmethod
    def update_visitor(cls, fingerprint_value, last_visit, visit_count, is_active=True):
        return cls.execute(UPDATE_VISITOR_QUERY, params=(last_visit, visit_count, is_active, fingerprint_value), commit=True )

    @classmethod
    def insert_visitor(cls, fingerprint_value, ip_address, location, browser, os, device_type,
                    first_visit, last_visit, visit_count=1, is_active=True):
        return cls.execute(INSERT_VISITOR_QUERY, params=(
                fingerprint_value, ip_address, location, browser, os, device_type,
                first_visit, last_visit, visit_count, is_active), commit=True )


    # ============================================================================================
    # =================================== LIKES QUERIES ==========================================
    # ============================================================================================   
    @classmethod
    def check_liked(cls, content_type, content_id, fingerprint):
        result = cls.execute(CHECK_LIKELOG_QUERY, params=(content_type, content_id, fingerprint), fetchone=True)
        return result is not None
    
    @classmethod
    def insert_like(cls, content_type, content_id, fingerprint):
        try:
            if cls.check_liked(content_type, content_id, fingerprint):
                return False
            cls.execute(INSERT_LIKELOG_QUERY, params=(content_type, content_id, fingerprint), commit=True)
            return True
        except Exception as e:
            print(f"[-] Error inserting like: {e}")
            return False


    # ============================================================================================
    # =================================== ANALYTICS QUERIES ======================================
    # ============================================================================================   
    @classmethod
    def get_quickanalytics(cls):
        return cls.execute(ANALYTICS_QUERY, fetchall=True)
    
    @classmethod
    def get_totalvisitors(cls):
        return cls.execute(TOTAL_VISITOR_QUERY, fetchone=True)
    
    @classmethod
    def get_toplikes(cls):
        return cls.execute(TOP_LIKE_QUERY, fetchall=True)
    
    @classmethod
    def get_likes_1_year(cls):
        return cls.execute(LIKES_BY_1_YEAR, fetchall=True)
    
    @classmethod
    def get_likes_1_month(cls):
        return cls.execute(LIKES_BY_1_MONTH, fetchall=True)
    
    @classmethod
    def get_likes_1_week(cls):
        return cls.execute(LIKES_BY_1_WEEK, fetchall=True)
    
    @classmethod
    def get_visitors_1_year(cls):
        return cls.execute(VISITORS_BY_1_YEAR, fetchall=True)
    
    @classmethod
    def get_visitors_1_month(cls):
        return cls.execute(VISITORS_BY_1_MONTH, fetchall=True)
    
    @classmethod
    def get_visitors_1_week(cls):
        return cls.execute(VISITORS_BY_1_WEEK, fetchall=True)


    # ============================================================================================
    # =================================== CAT, TAG, TECH QUERIES =================================
    # ============================================================================================   
    @classmethod
    def get_all_categories(cls):
        return cls.execute(CATEGORY_FETCH_ALL_QUERY, fetchall=True)
    
    @classmethod
    def get_category(cls, name):
        return cls.execute(CATEGORY_FETCH_QUERY, params=(name,), fetchone=True)
    
    @classmethod
    def add_category(cls, name, description):
        return cls.execute(CATEGORY_INSERT_QUERY, params=(name, description,), commit=True)

    @classmethod
    def get_all_tags(cls):
        return cls.execute(TAG_FETCH_ALL_QUERY, fetchall=True)
    
    @classmethod
    def get_tag(cls, name):
        return cls.execute(TAG_FETCH_QUERY, params=(name,), fetchone=True)
    
    @classmethod
    def add_tags(cls, name):
        return cls.execute(TAG_INSERT_QUERY, params=(name,), commit=True)
    
    @classmethod
    def get_all_techstack(cls):
        return cls.execute(TECHSTACK_FETCH_ALL_QUERY, fetchall=True)
    
    @classmethod
    def get_techstack(cls):
        return cls.execute(TECHSTACK_FETCH_QUERY, fetchone=True)

    @classmethod
    def add_techstack(cls, name, description):
        return cls.execute(TECHSTACK_INSERT_QUERY, params=(name, description,), commit=True)
