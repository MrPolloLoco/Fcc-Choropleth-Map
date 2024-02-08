// Making your functions and variables.

let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

let countyData
let educationData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {
    canvas.selectAll('path')
      .data(countyData)
      .enter()
      .append('path')
      .attr('d', d3.geoPath())
      .attr('class', 'county')
      .attr('fill', (countyDataItem) => {
        let id = countyDataItem['id']
        let county = educationData.find((item) => {
            return item['fips'] === id
        })
        let percentage = county['bachelorsOrHigher']
        if (percentage <= 15){
            return '#b22222'
        }else if (percentage <= 30){
            return '#ffa500'
        }else if (percentage <= 45){
            return '#ffff00'
        }else{
            return '#2e8b57'
        }
      })
      .attr('data-fips', (countyDataItem) => {
        return countyDataItem['id']
      })
      .attr('data-education', (countyDataItem) => {
        let id = countyDataItem['id']
        let county = educationData.find((item) => {
            return item['fips'] === id
        })
        let percentage = county['bachelorsOrHigher']
        return percentage
      })
      .on('mouseover', (countyDataItem) => {
        tooltip.transition()
          .style('visibility', 'visible')

        let id = countyDataItem['id']
        let county = educationData.find((item) => {
          return item['fips'] === id
    })

        tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' +
        county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')

        tooltip.attr('data-education', county['bachelorsOrHigher'])
    })
      .on('mouseout', (countyDataItem) => {
        tooltip.transition()
          .style('visibility', 'hidden')
    })
}

// Fetching the Data.

d3.json(countyURL).then(
    (data, error) => {
        if(error){
            console.log(error)
        }else{
            countyData = data
            countyData = topojson.feature(countyData, countyData.objects.counties).features
            console.log('County Data')
            console.log(countyData)

            d3.json(educationURL).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    }
                    else{
                        educationData = data
                        console.log('Education Data')
                        console.log(educationData)
                        drawMap()
                    }
                }
            )
        }
    }
)