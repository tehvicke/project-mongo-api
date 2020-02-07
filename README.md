# Mongo API Project

Technigo week 18 project - REST API connected to a Mongo DB


## View it live

Sample links for testing it out

Main endpoint: https://project-mongo-api-vd.herokuapp.com/

GET /avocado-sales
- mandatory params:
- - start : lower end of date range in string format YYYY-MM-DD
- - end : higher end of date range in string format YYYY-MM-DD
- optional filter params (either of these can be provided for better filtering):
- - page : page number to return, if the resulting array is more than 10 objects. Defaults to 1 if no page is given, and to the last available page if the page doesn't exist
start: mandatory - 
- - average-price-min : lower end of average price range
- - average-price-max : higher end of average price range
- - total-volume-min : lower end of total volume range
- - total-volume-max : higher end of total volume range
region: region in string format

Example working queries
- https://project-mongo-api-vd.herokuapp.com/avocado-sales?start=2015-12-19&end=2015-12-28&average-price-min=1&average-price-max=2&page=3&region=Detroit&total-volume-max=253000
- https://project-mongo-api-vd.herokuapp.com/
/avocado-sales/5e3d4591dfbe6d00230f9161

Every project should be deployed somewhere. Be sure to include the link to the deployed project so that the viewer can click around and see what it's all about.
