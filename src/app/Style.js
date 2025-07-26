const generateClasses = (base, responsive) => {
    let classes = base;
    // Loop through each breakpoint (sm, md, lg, etc.)
    for (const [breakpoint, value] of Object.entries(responsive)) {
        classes += ` ${breakpoint}:${value.replace(/\s+/g, ` ${breakpoint}:`)}`; 
    }
    return classes;
};

const summary = 'font-sans text-gray-400 text-sm';

const style = {
    root :{
        container : "bg-gray-800 min-h-screen text-white flex justify-center ",
        contentContainer : "container z-10 w-full flex flex-col justify-top items-center font-sans " + "lg:w-4/5"
        //container: "bg-transparent min-h-screen text-white flex justify-center",
        //contentContainer: "relative z-10 container w-full flex flex-col justify-top items-center font-sans lg:w-4/5"
  
    },
    header: {
        container: "container z-10 relative bg-slate-950 w-full max-h-16 rounded-b-lg border-b-2 border-gray-800 " + "lg:max-h-32 lg:w-3/5 lg:rounded-b-xl " ,
        //container: "z-10 relative container bg-slate-950 w-full max-h-16 rounded-b-lg border-b-2 border-gray-800 lg:max-h-32 lg:w-3/5 lg:rounded-b-xl",
        contentContainer: "flex items-center px-6 py-3 w-full justify-between ",
        logo: "h-12 pointer-events-none select-none " + " lg:h-16",
        menudiv: " lg:hidden ", 
        mobileMenu: "absolute w-full  w-48 bg-slate-900 p-2 top-15 mt-2 flex flex-col space-y-1 overflow-y-auto rounded-md " + " md:max-w-1/4 md:p-2 md:right-22  lg:hidden shadow-lg",
        menu: "flex items-center px-4 py-2 rounded-md transition duration-300 text-sm " + 
            "hover:bg-slate-800 hover:text-lime-400 hover:font-bold " +
            "focus:bg-slate-800 focus:text-lime-400 focus:font-bold ",
        menuButton: "text-gray-300 text-2xl cursor-pointer " + " lg:hidden", 
        //mobileMenu: "absolute top-12 right-2 w-48 bg-slate-900 p-2 rounded-md shadow-lg " + "sm:w-full sm:left-0 sm:top-16 md:w-48 md:right-2",
        
        icon: "w-5 h-5 mr-3" 
    },
    mainlayout: {
        container : "bg-none w-full h-full my-1 flex flex-col gap-y-3 min-h-full" + "md:flex-col "  + ' lg:flex-row lg:mx-5 lg:gap-x-1 lg:justify-end ' + " ",
        leftsidebar:  "hidden bg-slate-950 flex rounded-lg mt-2 " + ' md:mt-0 ' + " lg:flex lg:w-1/5 lg:rounded-none lg:rounded-t-lg lg:justify-center lg:sticky lg:top-0 lg:h-screen " + ' xl:w-1/6',
        main : "flex bg-slate-950  rounded-lg justify-center min-h-50"+ " " + " lg:w-3/5 lg:rounded-none lg:rounded-t-lg " + ' ',
        rightsidebar: `flex flex-col justify-between lg:w-1/5 lg:sticky lg:top-0 lg:h-screen bg-none rounded-lg lg:rounded-none lg:rounded-t-lg`,
    },
    
    blogmodule: {
        container: `flex flex-col border border-slate-800 justify-between items-center hover:border-lime-400 transition duration-100 hover:scale-102 group rounded-xl mx-5 mb-5 p-4 min-h-32 hover:bg-slate-900 transition duration-500 ` + ' md:flex-row',
        image: `w-2/3 h-full rounded-md pointer-events-none select-none md:w-1/5`,
        summaryContainer: `mx-5 flex flex-col justify-between md:min-h-full md:min-w-4/6`,
        header: `text-start font-medium text-lg text-gray-200 hover:shadow-md group-hover:text-lime-400`,
        summary: `mt-2 text-sm md:text-justify`,
        authordate: `flex flex-row justify-between mt-3 text-xs`,
        author: `text-lime-500 hover:font-bold `,
        readmore: `bg-gray-400 text-gray-900 rounded-full p-1 mt-2 hover:scale-125 hover:shadow-md hover:bg-slate-800 hover:text-lime-400`,
        categoryContainer: `flex items-center text-gray-400 text-xs mt-2`,
        categoryIcon: `text-lg text-lime-400 mr-1`,
        categoryText: `hover:text-lime-500 transition`,
        tagsContainer: `flex items-center gap-2 flex-wrap mt-2`,
        tag: `flex items-center bg-gray-700 hover:bg-slate-800 hover:text-lime-400 text-gray-300 text-xs px-2 py-1 rounded-md transition`,
        tagIcon: `mr-1`,
        likes: `ml-auto text-xs text-gray-400`,
    },
    leftbarmenu: {
        container: "flex flex-col w-full sm:w-60 text-gray-300 " +
                   "p-4 space-y-3 rounded-md shadow-lg",
        menuItem: "flex items-center space-x-2 px-5 py-2 rounded-md transition duration-50 text-sm transition hover:scale-105 " +
                  "hover:bg-slate-800 hover:text-lime-400 hover:font-bold " +
                  "focus:bg-slate-800 focus:text-lime-400 focus:font-bold",
        icon: "w-5 h-5 mr-3"
    },
    search: {
        container: `flex flex-col gap-5 p-4 text-white rounded-lg shadow-md mx-2`,
        header: `text-md font-semibold text-lime-400`,
        inputContainer: `flex flex-col md:flex-row gap-3 items-center`,
        searchBox: `flex items-center border border-gray-800 px-3 py-2 rounded-lg text-xs w-full md:w-2/3`,
        icon: `text-lime-400 mr-2`,
        input: `bg-transparent outline-none text-lime-400 ml-2 outline-none w-full`,
        dropdown: `border border-slate-800 text-lime-400 text-xs px-3 py-2 rounded-lg cursor-pointer outline-none
               hover:bg-slate-800 hover:border-lime-400 transition duration-200 ease-in-out ` + ' md:w-1/4',
    },
    pagination: {
        container: "flex justify-center mt-4 mb-10", // Increased bottom margin (mb-10)
        pagination: "text-white",
        muiOverrides: {
          "& .MuiPaginationItem-root": { color: "white" },
          "& .MuiPaginationItem-page.Mui-selected": { backgroundColor: "none", color: "white" },
          "& .MuiPaginationItem-page:hover": { backgroundColor: "rgba(50, 205, 50, 0.3)" }
        }
    },
    WriteupModule: {
        container: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6 p-5 mb-6 rounded-lg shadow-md `, // Grid with 3 items per row on large screens
        item: `bg-slate-900  p-4 rounded-lg shadow-md text-center border border-transparent hover:border-lime-400 transition duration-300 hover:scale-105 `,
        ImageName: ` hover:text-lime-400 `,
        image: `w-full h-auto rounded-full mb-4`,
        machineName: `text-lg font-semibold text-gray-300 mb-2 group-hover:text-lime-400 truncate whitespace-nowrap overflow-hidden`,
        difficulty: `text-sm text-gray-400 mb-2`,
        readmore: `text-lime-400 hover:text-lime-500 transition duration-200 ease-in-out`,
    },
    projectmodule: {
        container: `bg-slate-900 p-4 rounded-lg group shadow-md mb-6 mx-5 border border-transparent hover:border-lime-400 transition duration-300 hover:scale-101`,
        image: `w-full h-auto rounded-lg mb-4`,
        summaryContainer: `text-center  `,
        header: `text-xl font-semibold text-gray-300 mb-2 group-hover:text-lime-400`,
        summary: `text-gray-400 mb-4`,
        detailsContainer: `text-sm text-gray-400 mb-4`,
        categoryContainer: `flex items-center justify-center gap-2 mb-1`,
        categoryIcon: `text-lime-400`,
        categoryText: `text-lime-400 hover:text-lime-500`,
        tagsContainer: `flex gap-2 justify-center flex-wrap mb-4`,
        tag: `text-sm text-gray-400 hover:text-lime-400`,
        tagIcon: `inline-block mr-1`,
        linksContainer: `my-4 flex space-x-4 flex items-center justify-center `,
        demoButton: `bg-gray-800 text-white px-4 py-2 rounded hover:bg-slate-700 hover:text-lime-400 transition duration-200 ease-in-out`,
        repoButton: `bg-lime-950 text-white px-4 py-2 rounded hover:bg-lime-900 hover:text-lime-400 transition duration-200 ease-in-out`,
        readmore: `text-lime-400 hover:text-lime-500 transition duration-200 ease-in-out`,
    },
    podcastmodule: {
        container: `flex flex-col bg-gray-900 justify-between group items-center rounded-xl mx-5 mb-5 p-4 min-h-32 hover:bg-slate-900 transition duration-500 border border-transparent hover:border-lime-400 transition duration-300 hover:scale-101 ` + ` md:flex-row`,
        image: `w-2/3 h-full rounded-lg pointer-events-none select-none md:w-1/5`,
        elementsContainer: `mx-5 flex flex-col justify-between md:min-h-full md:min-w-4/6`,
        header: `text-start font-medium text-lg text-gray-200 hover:shadow-md group-hover:text-lime-400`,
        descriptionContainer: `flex flex-row w-full gap-4 items-start`, // horizontal layout
        summaryIcon: `text-white cursor-pointer hover:text-lime-400 mt-1 text-6xl ` + ` md:text-3xl` + ` lg:text-2xl`, // top-left icon
        description: `mt-2 text-sm md:text-justify`,
        allPlayContainer: `flex flex-col w-full`, 
        playerRow: `flex items-center gap-3 w-full`,
        playIcon: `text-3xl text-white cursor-pointer`,
        allPlayAttributes: `flex flex-col w-full`,
        controls: `flex gap-4 items-center mt-2`,
        controlIcon: `cursor-pointer text-lg text-white hover:text-lime-400`,
        speedButton: `cursor-pointer text-sm text-white p-1 hover:text-lime-400`,
        audioControlsWrapper: `flex-1`,
        metaContainer: "flex justify-between items-center text-xs text-zinc-400 mt-2",
        speakersContainer: "flex flex-wrap items-center gap-1",
        speakerLabel: "mr-1",
        speakerItem: "flex items-center",
        speakerLink: "text-lime-500 hover:font-bold",
        datePublished: "text-right",
    },
    audioProgressBar: {
        container: 'w-full mt-4',
        timeLabels: 'flex justify-between text-sm text-white mb-1',
        progressWrapper: 'w-full h-1 bg-gray-600 rounded-full relative overflow-hidden cursor-pointer',
        progressFill: 'h-full bg-red-500 transition-all duration-300',
    },
    achievementmodule: {
        headercontainer: `flex flex-col gap-5 p-4 text-white rounded-lg shadow-md mx-2`,
        header: `text-md font-semibold text-lime-400`,
        container: `bg-slate-900 p-4 pb-10 rounded-lg group shadow-md mb-6 mx-5`,
        image: `w-full h-auto rounded-lg mb-4`,
        summaryContainer: 'text-center ',
        title: `text-xl font-semibold text-gray-300 mb-2 group-hover:text-lime-400`,
        referenceButton: `bg-slate-950  text-lime-500 px-4 py-2 mt-2 rounded hover:bg-lime-900 hover:text-slate-100 transition duration-200 ease-in-out`,
        summary: `text-sm text-gray-400 my-5`,
        footerContainer: `flex justify-between items-center mt-4`,
        referenceWrapper: `flex-1 flex justify-center`,
        referenceButton: `bg-slate-950 text-lime-500 px-4 py-2 mt-2 rounded hover:bg-lime-900 hover:text-slate-100 transition duration-200 ease-in-out`,
        
    },
    latestModule: {
        mainContainer: "w-full min-h-1/4 py-4 px-1 bg-slate-950 rounded-md shadow-lg border border-slate-800  flex flex-col overflow-hidden ",
        titleContainer: "flex items-center justify-center mb-2",
        title: "text-md font-semibold text-lime-400",
        navIcon: "text-lime-400 text-xl mx-2 hover:text-white cursor-pointer transition duration-300 ease-in-out",
        centerContainer:  "flex items-center justify-center gap-2 w-full  pt-2", 
        imageSummaryContainer: "flex flex-col items-center justify-between w-4/5 text-center md:w-4/5 h-full",
        itemLink: "block w-full rounded-xl overflow-hidden hover:border hover:border-gray-800 transition duration-300",
        image: "w-full h-auto max-h-44 md:max-h-40 object-cover object-center",
        Summary: "text-xs text-white mt-2 px-1 line-clamp-2 leading-tight overflow-hidden",
    },
    footer: {
        mainContainer: "w-full mt-auto py-3 flex flex-col items-center justify-center bg-slate-950 rounded-md border border-slate-800 shadow-lg gap-2",
        iconContainer: "flex gap-3 text-xl text-lime-400",
        iconLink: "hover:text-white transition duration-300 ease-in-out",
        otherinfoContainer: "mt-1"
    },
    loading: {
        container: 'flex items-center justify-center h-full w-full',
        spinner: 'inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
        srOnly: '!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]', 
    },
    error: {
        container: 'flex items-center justify-center h-full w-full',
        text: 'text-red-500 font-semibold text-center text-sm md:text-base px-4',
    },
    contentmd: {
        container: "p-4 md:p-6 bg-slate-900lg:p-8 text-gray-300 dark:text-gray-100 rounded-xl shadow-lg",
        body: "prose mt-5 dark:prose-invert max-w-none prose-img:rounded-xl prose-img:mx-auto prose-img:my-4 prose-img:shadow-md prose-img:max-w-md",
        h1: "text-4xl font-bold mb-6 mb-4 text-white",
        h2: "text-3xl font-semibold mt-6 mb-4 text-white",
        h3: "text-2xl font-semibold mt-6 mb-4 text-white",
        h4: "text-xl font-semibold mt-6 mb-4 text-white",
        h5: "text-lg font-semibold mt-6 mb-4 text-white",
        h6: "text-base font-semibold mt-6 mb-4 text-white",
        hr: "my-4 border-t border-gray-800",
        paragraph: "mb-4 leading-relaxed text-gray-300",
        img: `rounded-xl shadow-md mx-auto my-4 md:w-4/5 w-full`,
        list: "list-disc ml-6 mb-4",
        listItem: "mb-2",

        link: "text-lime-500 hover:text-blue-400 underline transition duration-200",
        inlineCode: "bg-gray-900 text-lime-400 px-2 py-1 rounded text-sm font-mono",
        
        blockquote: "border-l-4 border-lime-500 pl-4 italic text-gray-400 my-4",
        table: "table-auto border-collapse w-full my-6",
        th: "border border-lime-500  px-4 py-2 bg-lime-700 text-left text-gray-200",
        td: "border border-lime-500  px-4 py-2 text-gray-300",
    },
    mdcontentHeader: {
        container: "flex flex-col  md:flex-row gap-6 items-start mb-6  pb-4",
        imgcontainer: "w-full md:w-1/4",
        img: "rounded-xl w-3/4 md:w-full object-cover",
        textcontainer: "w-full md:w-3/4 space-y-4",
        h1: "text-3xl font-bold mb-2 text-lime-400",
        belowh1: "flex items-center text-xs md:text-sm text-gray-400 gap-4 flex-wrap grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2",
        copybtn: `absolute top-2 right-2 z-10 px-2 py-1 text-xs bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-all duration-150 opacity-0 group-hover:opacity-100`,
        share: `cursor-pointer hover:text-lime-400 w-7 h-7 flex items-center justify-center transition duration-300`, 
        sharecopied: `absolute top-6 left-1/2 -translate-x-1/2 text-sm bg-gray-800 text-lime-400 px-2 py-1 rounded shadow`
    
    },
    mdcontentFooter: {
        uppercontainer: "mt-12 pt-6 border-t border-gray-800 dark:border-gray-900",
        maincontainer: `flex justify-between gap-6`,
        link: "inline-block w-full h-14 px-4 py-2 border border-slate-800 text-white dark:text-gray-100 rounded-md transition duration-300 hover:scale-105 hover:border-lime-400 text-[clamp(0.7rem,1.5vw,1rem)] overflow-hidden  ",
        disabled: "inline-block w-full h-14 px-4 py-2 text-gray-500 dark:text-gray-600 italic text-sm border border-slate-800 rounded-md",
    },
    likes :{
        likesContainer: `flex items-center gap-1 cursor-pointer hover:text-red-400 transition duration-150 ease-in-out`,
        likeIcon: `text-red-500 w-5 h-5`,
        likedIcon: `text-red-500 w-5 h-5 transition`,
        likesCount: `text-sm text-gray-400`,
    },
    Modal: {
        Dialog: `relative z-50`,
        BGDim: `fixed inset-0 bg-black/50`,
        ContentContainer: `fixed inset-0 flex items-center justify-center p-4`,
        DialogPanel: `w-full max-w-2xl rounded-xl bg-slate-900 p-6 text-gray-200 shadow-xl overflow-y-auto max-h-[90vh]`,
        SmallDialogPanel: `w-full max-w-md rounded-xl bg-slate-900 p-6 text-gray-200 shadow-xl overflow-y-auto max-h-[90vh]`,
        HeaderContainer: `flex justify-between items-center border-b border-gray-700 pb-3 mb-4`,
        Title: `text-xl font-semibold`,
        XButton: `text-gray-400 hover:text-white`,
        TextArea: `whitespace-pre-line leading-relaxed text-sm`,
        ReasonInput: `w-full p-2 bg-slate-800 border border-gray-600 rounded-md text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500`,
        InfoText: `text-sm text-gray-400 mb-2`,
        ErrorText: `text-red-500 text-sm mt-1`,
        ButtonRow: `mt-4 flex justify-end gap-2`,
        CancelButton: `px-4 py-2 text-sm rounded-md border border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700`,
        DeleteButton: `px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white`,
        ConfirmButton: `px-4 py-2 text-sm rounded-md bg-green-700 hover:bg-green-900 text-white`,
        // For Transition
        Enter: `ease-out duration-300`,
        EnterFrom: `opacity-0`,
        EnterTo: `opacity-100`,
        Leave: `ease-in duration-200`,
        LeaveFrom: `opacity-100`,
        LeaveTo: `opacity-0`,
        EnterScaleFrom: `opacity-0 scale-95`,
        EnterScaleTo: `opacity-100 scale-100`,
        LeaveScaleFrom: `opacity-100 scale-100`,
        LeaveScaleTo: `opacity-0 scale-95`,
    },

    ProfileModal: {
       // BGDimProfile: `fixed inset-0 bg-black/15`, //For some unknown reason this doesn't work else placed directly on the component
        image: `w-28 h-28 rounded-full mx-auto object-cover`,
        username: `text-center font-bold text-base`,
        bio: `text-center text-gray-300 italic`,
        socialLinkContainer: `flex justify-center space-x-4`,
        socialLink: `text-lime-400 hover:underline`,
    },
    ErrorHandle: {
        container: `flex flex-col items-center justify-center  min-h-full text-center px-4`,
        icon: `text-6xl text-lime-500 mb-4`,
        heading: `text-2xl font-semibold text-gray-200 mb-2`,
        message: `text-gray-400 mb-6`,
        button: `bg-lime-500 hover:bg-lime-600 text-gray-800 font-medium px-6 py-2 rounded-md`,
    },
    /*
    ===============================================================================================================
    ===========================================START OF THE DASHBOARD==============================================
    ===============================================================================================================
    */
    Login: {
        container: `flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-4`,
        card: `bg-slate-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-lime-700`,
        title: `text-3xl font-bold text-lime-400 text-center mb-6`,
        subtitle: `text-white text-lg font-semibold mb-4 text-center`,
        form: `space-y-4`,
        label: `block text-sm text-white mb-1`,
        input: `w-full px-4 py-2 rounded-md bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-lime-400`,
        button: `w-full py-2 bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed`,
        errorText: `text-xs text-red-500 mt-1`,
        footer: `text-xs text-gray-400 text-center mt-6`,
        errorBox: `text-base font-medium text-red-100 bg-red-600 border border-red-500 p-3 rounded-md shadow-sm`,
    },

    DashboardLayout: {
        wrapper: "flex flex-col h-screen w-screen overflow-hidden bg-slate-800 text-white",
        body: "flex flex-1 overflow-hidden relative",
        content: "flex-1 overflow-y-auto p-4 md:p-6",
    },

    dashHeader: {
        container: "w-full h-16 bg-slate-900 border-b border-slate-600 shadow flex items-center px-4 md:px-6 justify-between",
        logo: "text-lg md:text-xl font-bold text-lime-400",
        notification: "text-xs md:text-sm text-gray-500",
        menuButton: "md:hidden text-xl text-white cursor-pointer",
    },

    dashSideBar: {
        asideContainer: "hidden md:flex md:w-64 h-full bg-slate-950 text-white flex-col justify-between p-4 overflow-y-auto custom-scrollbar",
        menuItem: "flex items-center space-x-2 px-4 py-2 w-full text-left rounded-md transition duration-75 text-sm hover:scale-105 hover:bg-slate-800 hover:text-lime-400 hover:font-bold hover:cursor-pointer",
        menuItemActive: "bg-slate-800 text-lime-400 font-bold",
        footerContainer: "space-y-3 pt-4 border-t border-gray-700",
        footerProfile: "flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700 transition-all",
        footerProfileImg: "w-8 h-8 rounded-full object-cover",
        Icon: "text-base",
        menuItemLabel: "hidden lg:inline-block", // for desktop sidebar
        menuItemLabelMobile: "inline-block",     // always visible on mobile
    },

    mobileSidebar: {
        overlay: "fixed inset-0 bg-gray-800 bg-opacity-50 z-40 md:hidden",
        container: "fixed inset-y-0 left-0 w-64 bg-slate-950 text-white flex flex-col justify-between p-4 z-50 transition-transform transform duration-300 md:hidden overflow-y-auto custom-scrollbar",
        hidden: "-translate-x-full",
        visible: "translate-x-0",
    },
    dashboardStatsContainer: {
        sectionLayout: "w-full flex flex-col gap-6",
        topRow: "w-full flex flex-col md:flex-row gap-4",
        chartActionWrapper: "w-full flex flex-col md:flex-row gap-4",
        bottomGrid: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full ",
    },
    DashboardChartStyle: {
        wrapper: "w-full h-80 bg-slate-900 rounded-2xl shadow p-4",
        title: "text-lg text-center text-lime-400 font-semibold mb-4",
        chartArea: "w-full h-full", // Used by ResponsiveContainer
    },
   
    DashboardChartStyle: {
        wrapper: "w-full h-80 bg-slate-900 rounded-2xl shadow p-4 relative",
        title: "text-sm font-semibold text-lime-400 text-center mb-2",
        chartArea: "w-full h-[90%]",
        selectorWrapper: "absolute top-2 right-3 flex gap-1 z-10",
        selectorBtn: "px-2 py-[1px] rounded text-[10px] capitalize transition duration-150",
        activeSelector: "bg-lime-400 text-black font-semibold",
        inactiveSelector: "bg-slate-700 text-white hover:bg-slate-600",
    },

    actionButtons: {
        wrapper: "h-80 md:w-[80%] bg-slate-900 rounded-2xl shadow p-4 flex flex-col gap-4",
        title: "text-lg font-semibold text-lime-400 mb-2 text-center",
        buttonContainer: "flex flex-wrap gap-3 justify-center",
        button: "px-4 py-2 rounded-lg  text-gray-300 bg-slate-800 border border-slate-700 transition duration-75 text-sm hover:scale-105 hover:bg-gray-800 hover:text-lime-400 hover:font-bold hover:cursor-pointer text-center",
    },

    quickAnalytics: {
        wrapper:
            "bg-slate-900 rounded-2xl shadow p-4 flex flex-col gap-2 w-full h-full " +
            "border border-transparent hover:border-slate-600 hover:shadow-lg " +
            "hover:scale-[1.02] transition duration-200 ease-in-out",
        title: "text-sm text-center text-gray-400 mb-2 font-semibold",
        grid: "grid grid-cols-2 gap-4",
        item: "flex flex-col",
        label: "text-sm text-white",
        value: "text-4xl font-bold text-white mr-1 inline-block",
        subValue: "text-xs text-lime-400",
    },
    visitorsCount: {
        wrapper:
            "bg-slate-900 rounded-2xl shadow p-4 flex flex-col justify-between w-full h-full " +
            "border border-transparent hover:border-slate-600 hover:shadow-lg " +
            "hover:scale-[1.02] transition duration-200 ease-in-out",
        title: "text-sm text-center text-gray-400 mb-2 font-semibold",
        badgeContainer: "flex justify-end items-center",
        badge: "text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1",
        badgePositive: "text-green-400 bg-green-900",
        badgeNegative: "text-red-400 bg-red-900",
        total: "text-5xl font-bold text-white text-center my-6",
        description: "text-xs text-gray-400 text-center",
        icon: "w-3 h-3",
    },
    topLikedContents: {
        wrapper:
            "bg-slate-900 rounded-2xl shadow p-4 flex flex-col justify-between w-full h-full " +
            "border border-transparent hover:border-slate-600 hover:shadow-lg " +
            "hover:scale-[1.02] transition duration-200 ease-in-out",
        title: "text-sm text-center text-gray-400 mb-2 font-semibold",
        navIcon: "text-lime-400 text-xl mx-2 hover:text-white cursor-pointer transition duration-300 ease-in-out",
        centerContainer: "flex items-center justify-center gap-2 w-full pt-2",
        item: "block w-4/5 md:w-4/5 rounded-xl overflow-hidden border border-transparent hover:border-gray-800 transition duration-100",
        image: "w-full h-auto max-h-20 md:max-h-20 object-cover object-center",
        content: "text-center mt-2 px-1",
        type: "text-xs text-gray-400",
        name: "text-sm text-white font-medium line-clamp-2 leading-tight",
        likes: "text-xs text-lime-400 mt-1",
    },
    scheduledContents: {
        wrapper: "bg-slate-900 rounded-2xl shadow p-4 flex flex-col justify-between w-full h-full " +
                "border border-transparent hover:border-slate-600 hover:shadow-lg " +
                "hover:scale-[1.02] transition duration-200 ease-in-out",
        headerTitle: "flex justify-center mb-1",
        headerCount: "flex justify-end mb-2",
        totalBadge: "text-xs text-white bg-lime-500/10 border border-lime-400 px-2 py-0.5 rounded-full",
        title: "text-sm text-center font-semibold text-gray-400",
        navContainer: "flex items-center justify-center gap-3",
        navIcon: "text-lime-400 text-xl mx-1 hover:text-white cursor-pointer transition duration-300 ease-in-out",
        item: "flex flex-col bg-slate-800 rounded-md p-3 border border-slate-700 w-4/5",
        itemHeader: "flex items-center gap-1 mb-1",
        itemType: "text-xs font-medium text-lime-400",
        itemTitle: "text-sm text-white font-semibold",
        itemDate: "text-xs text-gray-400 mt-1 flex items-center",
        publishBtn: "mt-3 self-center w-2/3 text-sm h-9 bg-slate-700 hover:bg-slate-900 text-white hover:cursor-pointer font-semibold rounded-md transition duration-150",
    },
        blogMgmt: {
        wrapper: "w-full flex flex-col gap-6",
        header: "flex items-center justify-between mb-4",
        title: "text-xl font-semibold text-lime-400", // More vibrant, consistent with dark theme
        controls: "flex gap-2 items-center",
        actionBtn: "bg-slate-700 text-gray-200 px-3 py-1.5 rounded-md hover:bg-slate-600 transition text-sm shadow-sm",
        contentArea: "bg-slate-900 p-4 rounded-lg shadow-md border border-slate-700",
        searchBar: "mb-4 bg-slate-900 border border-slate-700 rounded-md px-2 py-1.5",
    },

    blogList: {
        wrapper: "space-y-4",
        item: "flex justify-between items-start bg-slate-950 p-4 rounded-xl shadow border border-slate-800",
        left: "flex gap-4",
        thumbnail: "w-20 h-20 object-cover rounded-lg ",
        info: "flex flex-col",
        title: "font-semibold text-lg text-lime-400",
        meta: "text-sm text-gray-400 mt-1",
        metaValue: "text-gray-300 font-medium",
        summary: "text-sm text-gray-400 mt-2 line-clamp-2",
        actions: "flex gap-2 items-center",
        noData: "text-center text-gray-500 text-sm py-4",
        ScheduledActionBtn: "mt-2 w-fit px-3 py-1 bg-yellow-600/20 text-yellow-400 text-xs font-semibold rounded-md hover:bg-yellow-600/30 transition flex items-center gap-2",
        DraftScheduledActionBtn: "mt-2 w-fit px-3 py-1 bg-orange-600/20 text-orange-400 text-xs font-semibold rounded-md hover:bg-orange-600/30 transition flex items-center gap-2",
        actionBtn: {
            preview: "p-2 bg-blue-700/10 text-blue-400 rounded hover:bg-blue-700/20 transition",
            edit: "p-2 bg-yellow-700/10 text-yellow-400 rounded hover:bg-yellow-700/20 transition",
            delete: "p-2 bg-red-700/10 text-red-400 rounded hover:bg-red-700/20 transition",
        },
    },
    contentMDEditor: {
        wrapper: "flex flex-col gap-4 bg-slate-900 p-4 rounded-lg shadow-md border border-slate-700",
        header: "flex justify-between items-center",
        title: "text-lg font-semibold text-white",
        viewToggle: "flex gap-2",
        active: "px-3 py-1 text-sm bg-lime-500 text-black rounded",
        inactive: "px-3 py-1 text-sm bg-slate-700 text-white rounded hover:bg-slate-800",
        buttons: "flex justify-end gap-2",
        draftBtn: "bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-800",
        publishBtn: "bg-lime-600 text-white px-4 py-2 rounded hover:bg-lime-800",
        scheduleBtn: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800",
        activeBtn: "bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-800",
    },
    tagSelector: {
        wrapper: "flex flex-col gap-2",
        inputContainer: "flex items-center gap-2",
        input: "w-full p-2 rounded-md bg-slate-800 text-white text-xs placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring focus:ring-lime-400",
        addBtn: "px-3 py-1.5 bg-lime-600 text-white text-sm rounded-md hover:bg-lime-700 transition",
        listWrapper: "flex gap-2 overflow-x-auto py-2 bg-slate-800 p-2 rounded border border-slate-700 custom-scrollbar",
        tagItem: "whitespace-nowrap px-3 py-1 text-sm rounded-full border border-indigo-500 text-indigo-400 bg-slate-900 cursor-pointer hover:bg-indigo-600 hover:text-white transition",
        tagSelected: "bg-lime-600 text-white border-transparent",
    },

    categorySelector: {
        wrapper: "flex flex-col gap-2",
        inputContainer: "flex items-center gap-2",
        input: "w-full p-2 rounded-md bg-slate-800 text-white text-xs placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring focus:ring-indigo-400",
        descriptionInput: "w-full p-2 rounded-md bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring focus:ring-indigo-400",
        addBtn: "px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition",
        listWrapper: "flex gap-2 overflow-x-auto py-2 bg-slate-800 p-2 rounded border border-slate-700 custom-scrollbar",
        categoryItem:  "whitespace-nowrap px-3 py-1 text-sm rounded-full border border-indigo-500 text-indigo-300 bg-slate-900 cursor-pointer hover:bg-indigo-600 hover:text-white transition",
        categorySelected: "bg-indigo-600 text-white border-transparent",
    },
    blogMeta: {
        wrapper: "flex flex-col grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800 p-4 rounded border border-slate-700",
        label: "text-sm text-gray-300",
        input: "w-full p-2 rounded-md bg-slate-900 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring focus:ring-indigo-500",
        textarea: "w-full p-2 h-24 resize-none rounded-md bg-slate-900 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring focus:ring-indigo-500",
        select: "w-full p-2 rounded-md bg-slate-900 text-white border border-slate-600 focus:outline-none focus:ring focus:ring-indigo-500",
        imageInputWrapper: "flex items-center gap-2",
        imageInput: "w-full p-2 rounded-md bg-slate-900 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring focus:ring-indigo-500",
        imagePreview: "w-32 h-20 object-cover rounded border border-slate-700",
    },
    uploads: {
        wrapper: "flex flex-col gap-4 bg-slate-800 p-4 rounded border border-slate-700",
        label: "text-sm text-gray-300",
        imageInputWrapper: "flex items-center gap-2",
        imageInput: "w-full p-2 rounded-md bg-slate-900 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring focus:ring-indigo-500",
        imagePreview: "w-32 h-20 object-cover rounded border border-slate-700",
        fileList: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 custom-scrollbar max-h-60 overflow-y-auto p-1 rounded",
        fileItem: "relative bg-slate-900 p-2 rounded hover:bg-slate-700 transition cursor-pointer border border-slate-600",
        audioItem: "text-xs text-indigo-300 break-all",
        linkLabel: "text-xs text-gray-400 mt-1 truncate",
        insertNotice: "text-xs text-gray-400 italic",
        uploadNotice: "text-sm text-yellow-500",
        errorNotice: "text-sm text-red-500",
    },
    contributorMgmt: {
        wrapper: "w-full p-4 md:p-6 lg:p-8 bg-slate-900 rounded-lg shadow",
        header: "flex flex-col sm:flex-row justify-between items-center mb-6",
        title: "text-xl md:text-2xl font-bold text-white mb-2 sm:mb-0",
        controls: "flex gap-3",
        actionBtn:
            "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium",
        searchBar: "mb-4",
        contentArea: "space-y-4",
        },

    contributorList: {
        wrapper: "grid gap-4",
        item: "bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col items-center",
        thumbnail: "w-20 h-20 rounded-full object-cover border border-gray-600 mb-3",
        title: "text-white font-semibold text-lg text-center",
        meta: "text-sm text-gray-400 text-center",
        metaValue: "text-white font-medium",
        typeDropdown: "mt-2 bg-gray-700 text-white text-sm rounded px-2 py-1 focus:outline-none",
        summary: "text-sm text-gray-300 mt-2 text-center overflow-hidden text-ellipsis whitespace-nowrap w-full",
        actionsBar: "flex justify-between gap-3 mt-4 w-full",
        actionBtn: {
            edit: "text-blue-400 hover:text-blue-500 transition text-lg",
            delete: "text-red-400 hover:text-red-500 transition text-lg",
        },
        noData: "text-center text-sm text-gray-400 mt-6",
    },

    toast: {
        success: {
        wrapper: 'fixed top-5 right-5 z-50 bg-green-500/95 text-white px-6 py-4 rounded-xl shadow-lg w-[300px] overflow-hidden flex items-start gap-3 animate-slide-in',
        icon: 'text-white text-lg mt-1',
        message: 'text-sm font-medium flex-1',
        progressBar: 'absolute bottom-0 left-0 h-1 bg-orange-400 animate-progress',
        },
        warning: {
        wrapper: 'fixed top-5 right-5 z-50 bg-yellow-500/95 text-white px-6 py-4 rounded-xl shadow-lg w-[300px] overflow-hidden flex items-start gap-3 animate-slide-in',
        icon: 'text-white text-lg mt-1',
        message: 'text-sm font-medium flex-1',
        progressBar: 'absolute bottom-0 left-0 h-1 bg-yellow-300 animate-progress',
        },
        failure: {
        wrapper: 'fixed top-5 right-5 z-50 bg-red-600/95 text-white px-6 py-4 rounded-xl shadow-lg w-[300px] overflow-hidden flex items-start gap-3 animate-slide-in',
        icon: 'text-white text-lg mt-1',
        message: 'text-sm font-medium flex-1',
        progressBar: 'absolute bottom-0 left-0 h-1 bg-red-300 animate-progress',
        },
    },

    writeupList: {
        wrapper: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
        item: "flex flex-col bg-slate-950 p-4 rounded-xl shadow border border-slate-800",
        contentRow: "flex gap-4",
        thumbnail: "w-24 h-24 object-cover rounded-lg shrink-0",
        info: "flex flex-col justify-between flex-1",
        title: "font-semibold text-lg text-lime-400",
        meta: "text-sm text-gray-400 mt-1",
        metaValue: "text-gray-300 font-medium",
        summary: "text-sm text-gray-400 mt-2 line-clamp-2",
        status: "mt-2 text-sm text-gray-400",
        ScheduledActionBtn: "mt-2 w-fit px-3 py-1 bg-yellow-600/20 text-yellow-400 text-xs font-semibold rounded-md hover:bg-yellow-600/30 transition flex items-center gap-2",
        DraftScheduledActionBtn: "mt-2 w-fit px-3 py-1 bg-orange-600/20 text-orange-400 text-xs font-semibold rounded-md hover:bg-orange-600/30 transition flex items-center gap-2",
        statusBadge: {
            Published: "text-lime-500 font-semibold",
            Scheduled: "text-yellow-400 font-semibold",
            Draft: "text-orange-400 font-semibold",
            Active: "text-blue-400 font-semibold",
        },
        actions: "mt-4 flex gap-2 items-center justify-start",
        actionBtn: {
            preview: "p-2 bg-blue-700/10 text-blue-400 rounded hover:bg-blue-700/20 transition",
            edit: "p-2 bg-yellow-700/10 text-yellow-400 rounded hover:bg-yellow-700/20 transition",
            delete: "p-2 bg-red-700/10 text-red-400 rounded hover:bg-red-700/20 transition",
        },
        noData: "text-center text-gray-500 text-sm py-4",
    },

    projectList: {
        wrapper: "grid grid-cols-1 sm:grid-cols-2 gap-6",
        item: "flex flex-col bg-slate-950 p-4 rounded-xl shadow border border-slate-800",
        
        // IMAGE on top and larger
        thumbnail: "w-full h-48 object-cover rounded-lg mb-4",

        info: "flex flex-col flex-1",
        title: "text-xl font-semibold text-lime-400",
        meta: "text-sm text-gray-400 mt-1",
        metaValue: "text-gray-300 font-medium",
        summary: "text-sm text-gray-400 mt-2 line-clamp-3",
        status: "mt-2 text-sm text-gray-400",

        statusBadge: {
            Published: "text-lime-500 font-semibold",
            Scheduled: "text-yellow-400 font-semibold",
            Draft: "text-orange-400 font-semibold",
            Active: "text-blue-400 font-semibold",
        },

        ScheduledActionBtn: "mt-2 w-fit px-3 py-1 bg-yellow-600/20 text-yellow-400 text-xs font-semibold rounded-md hover:bg-yellow-600/30 transition flex items-center gap-2",
        DraftScheduledActionBtn: "mt-2 w-fit px-3 py-1 bg-orange-600/20 text-orange-400 text-xs font-semibold rounded-md hover:bg-orange-600/30 transition flex items-center gap-2",

        actions: "mt-4 flex gap-2 items-center justify-start",
        actionBtn: {
            preview: "p-2 bg-blue-700/10 text-blue-400 rounded hover:bg-blue-700/20 transition",
            edit: "p-2 bg-yellow-700/10 text-yellow-400 rounded hover:bg-yellow-700/20 transition",
            delete: "p-2 bg-red-700/10 text-red-400 rounded hover:bg-red-700/20 transition",
        },

        noData: "text-center text-gray-500 text-sm py-4",
    },

    contributorModal: {
        Dialog: `relative z-50`,
        BGDim: `fixed inset-0 bg-black/50 z-50 overflow-y-auto`,
        panel: "w-full max-w-xl transform overflow-hidden rounded-2xl bg-gray-900 p-6 text-left align-middle shadow-xl transition-all border border-gray-700",
        title: "text-xl font-bold text-white mb-4 text-center",
        formGroup: "mb-4",
        label: "block text-sm font-medium text-gray-300 mb-1",
        input: "w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
        textarea: "w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24",
        select: "w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
        actions: "flex justify-end gap-4 mt-6",
        cancelBtn: "px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded hover:bg-gray-600 transition",
        saveBtn: "px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-500 transition",
    },
    
    teamList: {
        wrapper: "grid grid-cols-1 lg:grid-cols-3 gap-4",
        item: "bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col items-center relative",
        statusDot: "absolute top-2 right-2 w-3 h-3 rounded-full animate-pulse",
        status: {
            active: "bg-green-500",
            suspended: "bg-yellow-500",
            banned: "bg-red-500",
        },
        thumbnail: "w-20 h-20 rounded-full object-cover border border-gray-600 mb-3",
        title: "text-white font-semibold text-lg text-center",
        meta: "text-sm text-gray-400 text-center",
        metaValue: "text-white font-medium",
        typeDropdown: "mt-2 bg-gray-700 text-white text-sm rounded px-2 py-1 focus:outline-none",
        summary: "text-sm text-gray-300 mt-2 text-center overflow-hidden text-ellipsis whitespace-nowrap w-full",
        actionsBar: "flex flex-wrap justify-center items-center gap-2 mt-4 w-full", // Horizontal wrap instead of vertical stack on mobile
        actionBtn: {
            edit: "text-blue-400 hover:text-blue-500 transition text-xl",
            delete: "text-red-400 hover:text-red-500 transition text-xl",
            ban: "bg-red-400/30 text-white text-sm font-medium rounded px-3 py-1 hover:bg-red-700 transition",
            suspend: "bg-yellow-400/30 text-white text-sm font-medium rounded px-3 py-1 hover:bg-yellow-500 hover:text-black transition",
            activate: "bg-green-500/60 text-white text-sm font-medium rounded px-3 py-1 hover:bg-green-600 transition",
        },
        noData: "text-center text-sm text-gray-400 mt-6",
    },






};


export default style;

