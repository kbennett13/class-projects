# 
# CS 171 2012
# HW4 Skeleton Code 
#
# Uses data from CSV file containing data from US tornadoes in 2010.
# Extracts the latitude and longitude for the start position of each tornado.
# Plots these points on a map of the US.
#
# As in the spec, you will implement the following:
# For three different years
#  - Encode data for magnitude (F-scale)
#  - Encode data for another field of your choice
# 
# Using data from the years you have chosen
#  - Plot the April tornadoes for these years
#    with the data from the April 25-28, 2011 data
#

from mpl_toolkits.basemap import Basemap
import matplotlib.pyplot as plt
import numpy as np
import csv

# Specify the map boundaries and projection type
map_func = Basemap(llcrnrlon= -120, llcrnrlat=23, urcrnrlon=-65, urcrnrlat=48,
                   projection='tmerc', lon_0 = -95, lat_0 = 35,
                   resolution = 'l')

# Plots the first 2 tasks. If the argument is 1, it plots task 1.
def fujita(num):
    with open('2005-2007_torn.csv', 'r') as torntxt:
        lines = torntxt.readlines()
    
    # Prepare lists of latitudes and longitudes
    tornTuple = [line.split(',') for line in lines]
    intensities = [float(tuple[10]) for tuple in tornTuple]
    fatalities = [int(tuple[12]) for tuple in tornTuple]
    lats = [float(tuple[15]) for tuple in tornTuple]
    lons = [float(tuple[16]) for tuple in tornTuple]


    # Draw some features of the map
    # For more fill options refer to the Basemap Resources in the HW4 spec.
    map_func.drawcoastlines(color = 'gray')
    map_func.drawcountries(color = 'gray')
    map_func.drawstates(color = 'gray')
    map_func.fillcontinents(color = 'beige')
    map_func.drawmapboundary()

    # Plot tornadoes by coordinates
    x,y = map_func(lons, lats)

    # Plotting in a single color with slight transparency
    for i in range(0, len(x)):
        if num == 1:
            map_func.plot(x[i],y[i],'o', c=(0, (102./255), 1), alpha=(intensities[i]/6.))
        else:
            map_func.plot(x[i],y[i],'o', c=(((fatalities[i]+1)/float((max(fatalities))+1)), 0, 0), alpha=((fatalities[i]+1)/float((max(fatalities))+1)))

    plt.show()


# Plots Task 3, all tornadoes between April 25th and April 28th, 2011.
def april2011():
    with open('25-28.csv', 'r') as eleventxt:
        lines = eleventxt.readlines()

    elevenTuple = [line.split(',') for line in lines]
    elevenlats = [float(tuple[5]) for tuple in elevenTuple]
    elevenlons = [float(tuple[6]) for tuple in elevenTuple]

    map_func2 = Basemap(llcrnrlon= -100, llcrnrlat=23, urcrnrlon=-60, urcrnrlat=48,
                       projection='tmerc', lon_0 = -95, lat_0 = 35,
                       resolution = 'l')

    map_func2.drawcoastlines(color = 'gray')
    map_func2.drawcountries(color = 'gray')
    map_func2.drawstates(color = 'gray')
    map_func2.fillcontinents(color = 'beige')
    map_func2.drawmapboundary()

    eleven_x,eleven_y = map_func2(elevenlons, elevenlats)

    map_func2.plot(eleven_x,eleven_y,'o', c=((51./255), 1, 1), alpha=.5)

    plt.show()


# Plots Task 4, a combination of task 3 and all tornadoes in April 2005, 2006, and 2007.
def april():
    with open('2005-2007_torn.csv', 'r') as torntxt:
        lines = torntxt.readlines()
    
    tornTuple = [line.split(',') for line in lines]

    april2005lats, april2005lons = [], []
    april2006lats, april2006lons = [], []
    april2007lats, april2007lons = [], []

    for tuple in tornTuple:
        if int(tuple[2]) == 4:
            if int(tuple[1]) == 2005:
                april2005lats.append(float(tuple[15]))
                april2005lons.append(float(tuple[16]))
            if int(tuple[1]) == 2006:
                april2006lats.append(float(tuple[15]))
                april2006lons.append(float(tuple[16]))
            if int(tuple[1]) == 2007:
                april2007lats.append(float(tuple[15]))
                april2007lons.append(float(tuple[16]))

    with open('25-28.csv', 'r') as eleventxt:
        lines = eleventxt.readlines()

    elevenTuple = [line.split(',') for line in lines]
    elevenlats = [float(tuple[5]) for tuple in elevenTuple]
    elevenlons = [float(tuple[6]) for tuple in elevenTuple]

    map_func.drawcoastlines(color = 'gray')
    map_func.drawcountries(color = 'gray')
    map_func.drawstates(color = 'gray')
    map_func.fillcontinents(color = 'beige')
    map_func.drawmapboundary()

    x0, y0 = map_func(april2005lons, april2005lats)
    x1, y1 = map_func(april2006lons, april2006lats)
    x2, y2 = map_func(april2007lons, april2007lats)
    x3, y3 = map_func(elevenlons, elevenlats)

    map_func.plot(x0, y0, 'x', c=((51./255), (153./255), 1), alpha=1, label='2005')
    map_func.plot(x1, y1, 'x', c=((153./255), (51./255), 1), alpha=1, label='2006')
    map_func.plot(x2, y2, 'x', c=(1, (102./255), (102./255)), alpha=1, label='2007')
    map_func.plot(x3, y3, 'x', c=((204./255), (153./255), 0), alpha=1, label='2011')

    plt.legend(loc=3)

    plt.show()