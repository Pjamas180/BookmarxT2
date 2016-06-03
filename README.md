# BookmarxT2

Bookmarx Application created for Thomas Powell's CSE 136 Enterprise Applications class.

The application is designed to allow users to keep track of their favorite sites in one place. They can add, delete, modify and share their Bookmarx with other people!

The class emphasizes the idea of "enterprise" applications, meaning that the application is scalable and secure.

Server-side: NodeJS
Database: MySQL

Developed By:

Nina Delossantos
Samantha Hahn
Dennis Ku
Spencer Rothschild
Pedro Villaroman

## Features (AKA Work Done)
* **Javascript-independent functions (Iteration 1)**
 * Create, read, update, delete on server-side
 * Server-side validation on all fields
 * Rendering pages directly from the server if Javascript is turned off in the browser
* **Javascript-dependent functions (Iteration 2)**
 * Create, read, update, delete via AJAX calls to API
 * Build Bookmarx API with GET, POST, DELETE, PUT requests
 * Rendering templates on client side (single-page application)
* **Isomorphic Application**
 * Create, read, update, delete features/pages work with Javascript turned off or on in the browser
  * If Javascript is turned on, AJAX version will be loaded and rendered
  * If Javascript is turned off, server-side version will be loaded and rendered
* **Sort, search, starring, tags**
 * Sorting options
   * Title Asc/Desc
    * Create Date Asc/Desc
    * Update Date Asc/Desc
    * Starred/Unstarred
 * Search functions will search for the bookmark by the title
 * Updating starred bookmarks can be done through the edit page of the respective bookmark
 * Clicking on a tag on the bookmark tiles will find the bookmarks with the same tag
* **JS/CSS management**
 * Minify and bundle JS/CSS with Grunt
* **Compression - simple version included**
* **Code Management/Cleanup**
 * Minimum code was written to implement the functionalities of the application
 * Minimized the number of dependencies on NodeJS
   * Having dependencies would make the task easier but can also be bloated and/or overkill
* **Security**
 * Password-hashing
* **Login, logout, session management**

## Who Worked on What (see bolded points above for more details)
* **Dennis Ku**
 * Client-Side (Iteration 2)
   * Create, read, update, and delete AJAX calls to the API
    * Rendering the templates on the client-side as a one-page application
    * Prepared EJS templates to support Javascript
 * Server-Side (Iteration 1)
   * Create, read, update, and delete functions for API
    * Server-side validation
    * Wrote SQL queries for CRUD functions, sort, search, and tags
    * Helped design database schema
    * Rendered the templates on server-side
    * Modified HTML template to support data
 * Isomorphic Application (see above)
 * Compression - very simple version
 * JS/CSS management (see above)
 * General bug-fixing/provide help and resources to teammates
* **Samantha Hahn**
 * Client-Side
   * Made templates responsive
    * Styled login and signup pages
    * Fixed HTML markup issues
    * Fixed CSS issues
