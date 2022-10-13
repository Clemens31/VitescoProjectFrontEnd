/**
 *  Application Constants
 */


export class Constants {

    /** Title application. */
    static APP_TITLE = "Arrival and Departure" ;

    /***************************************/
    /* Endpoints */
    /***************************************/

    /** Login Register */ 
    static AUTHENTICATE = "authenticate";
    static REGISTER = "register";

    /***************************************/

    /** Creation Arrival */ 
    static SAVE_ARRIVAL = "arrival";

    /** Get List Arrivals */
    static GET_ARRIVALS = "arrivals"
    static GET_ARRIVALS_NOT_FULL_REGISTRY = "arrivals/notfullregistry"

    static GET_ARRIVAL = "arrival"

    /** Update Arrival*/
    static UPDATE_EMPLOYEE = "employee";
    static UPDATE_ARRIVAL = "arrival";
    static UPDATE_ORDER = "order";
    static UPDATE_EQUIPMENT_NEED = "equipmentneed";
    static UPDATE_SCHOOL_OR_COMPANY ="schoolorcompany";
    static UPDATE_COMMENT = "comment";
    static UPDATE_RIGHT = "rights"
    static UPDATE_RIGHT_FIRST_SECTION = "rights/firstsection"
    static UPDATE_RIGHT_SECOND_SECTION = "rights/secondsection"
    static UPDATE_RIGHT_THIRD_SECTION = "rights/thirdsection"
    static UPDATE_RIGHT_FOURTH_SECTION = "rights/fourthsection"
    
    static RECORDING_COMPLETED = "The arrival has been saved";
    static UPDATE_COMPLETED = "The change has been done";
    static CLOSE_ARRIVAL_MESSAGE = "Arrival has been archived";
    static DELETE_ARRIVAL_MESSAGE ="Arrival has been deleted";

    /* Delete Arrival */
    static DELETE_ARRIVAL = "arrival";

    /* Closing Arrival */
    static CLOSING_ARRIVAL = "arrival/archive"

    /***************************************/

    /** PlaceOfActivity Endpoints */
    static GET_ALL_PLACEOFACTIVITY = "placesofactivities";
    static SUR_SITE ="Sur Site";

    /** TypeOfContract Endpoints */
    static GET_ALL_TYPEOFCONTRACT = "typesofcontracts";

    static EXTERNE ="EXTERNE";
    static STAGE_MOINS_3_MOIS = "STAGE -3 MOIS";
    static STAGE_3_MOIS_ET_PLUS = "STAGE 3 MOIS ET PLUS";
    static CDI = "CDI";
    static CDD = "CDD OU CONTRAT SPÉCIAL";
    static EXPAT = "EXPAT";
    static ALTERNANT = "ALTERNANT";


    /** Compagnies Endpoints */
    static GET_ALL_COMPANIES = "companies";
    static GET_COMPANY = "company";
    static SAVE_COMPANY = "company";
    static UPDATE_COMPANY = "company";
    static DELETE_COMPANY = "company";

    /** Schools Endpoints */
    static GET_ALL_SCHOOLS = "schools";
    static GET_SCHOOL = "school";
    static SAVE_SCHOOL = "school";
    static UPDATE_SCHOOL = "school";
    static DELETE_SCHOOL = "school";

    /** Equipment */
    static GET_ALL_EQUIPMENTS = "equipments";

    /** Computer Type */
    static GET_ALL_TYPES_COMPUTERS ="typescomputers";

    /** Computer Power */
    static GET_ALL_COMPUTER_MODELS ="computermodels";

    /** Platform Endpoints */
    static GET_ALL_PLATFORMS = "platforms";

    /** Rights */
    static GET_ALL_RIGHTS = "rights"

    /***************************************/

    // Managers
    static GET_MANAGERS = "admin/managers";
    static GET_MANAGER = "admin/manager";
    static UPDATE_MANAGER = "admin/manager/update"; 
    static DELETE_MANAGER = "admin/manager/delete";

    /***************************************/
    /* Assets */
    /***************************************/

    /** Images */
    static SIGN_IN_VERTICAL_IMAGE ="../../assets/images/signInVertical.png" 
    static SIGN_IN_HORIZONTAL_IMAGE ="../../assets/images/signInHorizontal.png"
    static REGISTER_VERTICAL_IMAGE ="../../assets/images/registerVertical.PNG"
    static REGISTER_HORIZONTAL_IMAGE ="../../assets/images/registerHorizontal.PNG"
    static IMAGE_LOGO_VITESCO ="../../assets/images/vt_logo_100mm_rgb_vt_brand_grey.png"
    
    /** Icon */
    static ICON_MENU_BURGER = "../assets/images/vt_icon_rgb_300dpi_vt_brand_grey_menu.png";
    static ICON_MENU_BURGER_HOVER = "../assets/images/vt_icon_rgb_300dpi_vt_brand_red_menu.png";
    static ICON_CLOSE_BURGER = "../assets/images/vt_icon_rgb_300dpi_vt_brand_grey_close.png";
    static ICON_CLOSE_BURGER_HOVER = "../assets/images/vt_icon_rgb_300dpi_vt_brand_red_close.png";
    static ICON_MYACCOUNT = "../assets/images/vt_icon_rgb_300dpi_vt_brand_grey_my_settings.png";
    static ICON_MYACCOUNT_HOVER = "../assets/images/vt_icon_rgb_300dpi_vt_brand_red_my_settings.png";
    static ICON_VALID = "../assets/images/vt_icon_rgb_72dpi_black_check.png";
    static ICON_CONSULT = "../assets/images/vt_icon_rgb_72dpi_black_magnifying_glass_plus.png";
    static ICON_CONSULT_HOVER = "../assets/images/vt_icon_rgb_72dpi_vt_brand_red_magnifying_glass_plus.png";
    static ICON_EDIT = "../assets/images/vt_icon_rgb_72dpi_black_edit.png";
    static ICON_EDIT_HOVER = "../assets/images/vt_icon_rgb_72dpi_vt_brand_red_edit.png";
    static ICON_EDIT_WHITE = "../assets/images/vt_icon_cmyk_300dpi_vt_brand_white_edit.png";
    static ICON_DELETE = "../assets/images/vt_icon_rgb_72dpi_black_delete.png";
    static ICON_DELETE_HOVER = "../assets/images/vt_icon_rgb_72dpi_vt_brand_red_delete.png";
    static ICON_SEARCH ="../assets/images/vt_icon_rgb_300dpi_black_search.png";
    static ICON_OPTIONS = "../assets/images/vt_icon_rgb_300dpi_vt_brand_grey_system_understanding_02.png";
    static ICON_OPTIONS_HOVER = "../assets/images/vt_icon_rgb_300dpi_vt_brand_red_system_understanding_02.png";
    static ICON_ACCOUNT = "../assets/images/vt_icon_rgb_300dpi_black_careers.png";

    /** Icons Languages */
    static ICON_FR_LANGUAGES = "../assets/images/vt_icon_rgb_300dpi_black_language_flag_french.png";
    static ICON_EN_LANGUAGES = "../assets/images/vt_icon_rgb_300dpi_black_language_flag_english.png";


    /** Pop Up Manager */
    static LOGO_ADD_MANAGER = "../assets/images/vt_icon_rgb_300dpi_vt_brand_white_my_settings.png";
    static LOGO_EDIT_MANAGER = "../assets/images/vt_icon_rgb_300dpi_vt_brand_white_edit.png";
    static LOGO_DELETE_MANAGER = "../assets/images/vt_icon_rgb_300dpi_vt_brand_white_delete.png";

    /** Colors */
    static BACKGROUND_COLOR_WHITE = "rgba(255, 255, 255)";
    static BACKGROUND_COLOR_YELLOW = "rgba(240, 230, 20)";
    static BACKGROUND_COLOR_GREY = "rgba(75, 75, 70)";
    static BACKGROUND_COLOR_PINK = "rgba(215, 0, 75)";
}
