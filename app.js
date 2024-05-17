// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {  

    // get the metadata field
    
    var metadataField = data.metadata;

  // Filter the metadata for the object with the desired sample number

    var desiredSampleMetadata = metadataField.filter(metadata => metadata.id == sample);
    
    let result = desiredSampleMetadata[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    
    var metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
   
    metadataPanel.html("");

    // Inside a loop, you will need to use d3 to append new
   
    for(key in result){
    
    // tags for each key-value in the filtered metadata.

      metadataPanel.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
    };
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field

    var samples = data.samples;

    // Filter the samples for the object with the desired sample number

    var sampleData = samples.filter(sampleObj => sampleObj.id === sample)[0];

    // Get the otu_ids, otu_labels, and sample_values

      var otuIds = sampleData.otu_ids;
      var otuLabels = sampleData.otu_labels;
      var sampleValues = sampleData.sample_values;

    // Build a Bubble Chart
    var bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds
      }
    };

    var bubbleData = [bubbleTrace];

    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' }
    };

    // Render the Bubble Chart

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks

    var yticks = otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately

    var barTrace = {
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      text: otuLabels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    };

    var barData = [barTrace];

    var barLayout = {
      title: 'Top 10 Bacterial Cultures Found',
      xaxis: { title: 'Number of Bacteria' },
      yaxis: { title: 'OTU ID' }
    };


    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

 // Get the names field
    let names = data.names;
 
    console.log("Names:", names);

    // Use d3 to select the dropdown with id of `#selDataset`

    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.


    // names.forEach((sample) => {
    for (let i = 0; i < names.length; i++) {
    dropdownMenu.append("option")
              .text(names[i])
              .property("value", names[i]);
    };

    // Get the first sample from the list

    var firstSample = names[0];

    console.log("First Sample:", firstSample);

    // Build charts and metadata panel with the first sample

    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener

function optionChanged(newSample) {
 
  console.log("New Sample:", newSample);

  // Build charts and metadata panel each time a new sample is selected
  
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();