# Mongo API Project

Replace this readme with your own information about your project. 

Start by briefly describing the assignment in a sentence or two. Keep it short and to the point.

## The problem

Describe how you approached to problem, and what tools and techniques you used to solve it. How did you plan? What technologies did you use? If you had more time, what would be next?

## View it live

Sample links for testing it out

http://localhost:8080/avocado-sales?start=2015-12-19&end=2015-12-28&average-price-min=1&average-price-max=2&page=3&region=Detroit&total-volume-max=253000

Endpoint: https://project-mongo-api-vd.herokuapp.com/

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

Every project should be deployed somewhere. Be sure to include the link to the deployed project so that the viewer can click around and see what it's all about.
