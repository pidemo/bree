// Global variables defined here
const departmentIds = [];
const root = document.getElementById("root");
const loading = document.getElementById("loading");
const departmentFilter = document.getElementById("filter");
const locationFilter = document.getElementById("locations");
const errorWrapper = document.getElementById("errwrapper");
const errorText = document.getElementById("errtext");
let allCities = [];

// Filtering function for select department
departmentFilter.onchange = function () {
  let selectedSection = this.value;
  let filtered = document.querySelectorAll(".department-section");
  if (selectedSection == "all") {
		//let filtered = document.querySelectorAll(".department-section");
    filtered.forEach((filtered) => {
      filtered.style.display = "block";
    });
  } else {
    //let filtered = document.querySelectorAll(".department-section");
    filtered.forEach((filtered) => {
      filtered.style.display = "none";
    });
    document.getElementById(selectedSection).style.display = "block";
  }
};

// Filtering function for select location
locationFilter.onchange = function () {
    let selectedLocation = this.value;
  
    let allJobs = document.querySelectorAll(".job-listing-2");
    if (selectedLocation == "all") {
        allJobs.forEach((job) => {
        job.style.display = "flex";
        });
    } else {
        // loop through each item of allJobs, and get the string of locations for each item (has a class of .job-location-2)
        allJobs.forEach(function(job) {
        let jobLocation = job.querySelector(".job-location-2").textContent;
    
        // compare the string of locations for each job, and if it does not contain the selectedLocation, then set its display property to none.
        if (jobLocation.indexOf(selectedLocation) === -1) {
            job.style.display = "none";
        } else {
            job.style.display = "flex";
        }
        });
    }
    // Get all elements with the class .department-section
    const parents = document.querySelectorAll('.department-section');

    // Iterate over each .department-section
    parents.forEach((parent) => {
        // Use querySelectorAll to select children with the specified class
        const jobListings = parent.querySelectorAll('.job-listing-2');

        // Filter job listings with display: flex
        const flexJobListings = Array.from(jobListings).filter((listing) => {
        const computedStyle = window.getComputedStyle(listing);
        return computedStyle.getPropertyValue('display') === 'flex';
        });

        // Count and log the number of job listings with display: flex
        const flexChildrenCount = flexJobListings.length;
        
        // Hide the parent if no flex children are found
        if (flexChildrenCount === 0) {
            parent.style.display = 'none';
        } else {
            // Ensure the parent is visible if it was previously hidden
            parent.style.display = 'block';
        }
    });

};

// need to revert this ?


// Triggers when the DOM is ready
window.addEventListener("DOMContentLoaded", (event) => {
  const handleError = (response) => {
    if (!response.ok) {
      throw Error(` ${response.status} ${response.statusText}`);
    } else {
      return response.json();
    }
  };
  fetch(
    "https://boards-api.greenhouse.io/v1/boards/soundcloud71/departments/"
  )
    .then(handleError)
    .then((data) => {
      data.departments.forEach((department) => {
        if (department.jobs.length !== 0) {
          departmentIds.push(department.id);
          let sectionWrapper = document.getElementById("section");
          let sectionClone = sectionWrapper.cloneNode(true);
          sectionClone.id = department.id;
          root.appendChild(sectionClone);
          let option = document.createElement("option");
          option.text = department.name;
          option.value = department.id;
          departmentFilter.add(option);
        } else {
          null;
        }
      });
    })
    .catch(function writeError(err) {
      console.error(err);
    })
    .finally(() => {
      writeJobs();
    }); 
});
// Triggered in finally above
function writeJobs() {
  departmentIds.forEach((departmentId) => {
    const handleError = (response) => {
      if (!response.ok) {
        throw Error(` ${response.status} ${response.statusText}`);
      } else {
        return response.json();
      }
    };
    fetch(
      "https://boards-api.greenhouse.io/v1/boards/soundcloud71/departments/" +
        departmentId
    )
      .then(handleError)
      .then((data) => {
        let parent = document.getElementById(data.id);
        let parentContainer = parent.getElementsByClassName("container-2")[0];
        let sectionHeading = document.getElementById("dname");
        let sectionTitle = sectionHeading.cloneNode(true);
        sectionTitle.innerText = data.name;
        parentContainer.appendChild(sectionTitle);
        data.jobs.forEach((job) => {
          let listing = document.getElementById("listing");
          let ghListing = listing.cloneNode(true);
          ghListing.id = job.id;
          let jobTitle = ghListing.getElementsByClassName("job-title-2")[0];
          jobTitle.innerText = job.title;
          jobTitle.setAttribute("href", job.absolute_url);
          let jobLocation = ghListing.getElementsByClassName("job-location-2")[0];
          jobLocation.innerText = job.location.name;
          parentContainer.appendChild(ghListing);
          //push locations filter
          // Get the text content of the job location element
          let cityString = job.location.name;
          // Split the city string into an array using commas as separators
          let citiesArray = cityString.split(',').map(city => city.trim());
          //console.log(cityString, citiesArray);
          // Merge the current cities array with the overall array
          console.log(`Before :${allCities}`);
          allCities = allCities.concat(citiesArray);
          console.log(`After :${allCities}`);
        });
      })
      .catch(function writeError(err) {
        console.error(err);
      })
      .finally(() => {   
        // Remove duplicates from the merged array
        let uniqueLocations = Array.from(new Set(allCities));
        // Log the result
        console.log(uniqueLocations);     
        loading.classList.add("invisible");
        loading.remove();
        root.classList.add("visible");
      });
  });
    
}


/*

Has been simplified now

// Get all job listing elements
const jobListings = document.querySelectorAll('.job-listing-2');


// Loop through each job listing
jobListings.forEach((jobListing) => {
// Find the job location element within the current job listing
const jobLocation = jobListing.querySelector('.job-location-2');
// Check if the job location element exists
if (jobLocation) {
    // Get the text content of the job location element
    const cityString = jobLocation.textContent;
    // Split the city string into an array using commas as separators
    const citiesArray = cityString.split(',').map(city => city.trim());
    // Merge the current cities array with the overall array
    allCities = allCities.concat(citiesArray);
}
});



// Remove duplicates from the merged array
let uniqueLocations = Array.from(new Set(allCities));
// Log the result
console.log(uniqueLocations);
uniqueLocations.forEach((location) => {
    let option = document.createElement("option");
    option.text = location;
    option.value = location;
    locationFilter.add(option);
});

*/