document.addEventListener("DOMContentLoaded", () => {
    const handleError = (response) => {
      if (!response.ok) {
        throw Error(`${response.status} ${response.statusText}`);
      } else {
        return response.json();
      }
    };
  
    const fetchData = (url) => fetch(url).then(handleError);
  
    const allJobs = document.querySelectorAll(".job-listing-2");
  
    const root = document.getElementById("root");
    const loading = document.getElementById("loading");
    const departmentFilter = document.getElementById("filter");
    const locationFilter = document.getElementById("locations");
    const errorWrapper = document.getElementById("errwrapper");
    const errorText = document.getElementById("errtext");
    const departmentIds = [];
  
    locationFilter.onchange = function () {
      // Existing location filter code...
    };
  
    const fragment = document.createDocumentFragment();
  
    fetchData("https://boards-api.greenhouse.io/v1/boards/soundcloud71/departments/")
      .then((data) => {
        const uniqueCities = ["All Offices"];
  
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
          }
        });
  
        locationFilter.innerHTML = "";
        uniqueCities.forEach((location) => {
          let option = document.createElement("option");
          option.text = location;
          option.value = location;
          fragment.appendChild(option);
        });
        locationFilter.appendChild(fragment);
  
      })
      .catch((err) => console.error(err))
      .finally(() => {
        writeJobs();
      });
  });
  
  function writeJobs() {
    departmentIds.forEach((departmentId) => {
      const handleError = (response) => {
        if (!response.ok) {
          throw Error(`${response.status} ${response.statusText}`);
        } else {
          return response.json();
        }
      };
  
      fetchData(`https://boards-api.greenhouse.io/v1/boards/soundcloud71/departments/${departmentId}`)
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
  
            let cityString = job.location.name;
            let citiesArray = cityString.split(',').map(city => city.trim());
            allCities = allCities.concat(citiesArray);
            const uniqueCities = Array.from(new Set(allCities));
  
            locationFilter.innerHTML = "";
            uniqueCities.forEach((location) => {
              let option = document.createElement("option");
              option.text = location;
              option.value = location;
              locationFilter.add(option);
            });
          });
        })
        .catch((err) => console.error(err))
        .finally(() => {
          loading.classList.add("invisible");
          loading.remove();
          root.classList.add("visible");
        });
    });
  }  