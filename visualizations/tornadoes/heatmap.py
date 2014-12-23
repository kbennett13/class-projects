# 
# CS 171 2012
# HW4 Skeleton Code 
#
# Uses data from CSV file containing data from US tornadoes in 2010.
# Extracts the latitude and longitude for the start position of each tornado.
# Produces a heat map from the density of tornadoes
#
# As in the spec, you will implement the following:
#  - using a combination of the tornadoes in 2008, 2009 and 2010,
# produce a heat map, with an appropriate binning.
#  - choose three color maps (rainbow, a continuous colormap of your own, 
# and a discrete color map) for three heat maps, display them as color bars

from mpl_toolkits.basemap import Basemap
from pylab import *
from scipy import interpolate
import matplotlib.pyplot as plt
import numpy as np
import csv

# Tornado 2010 data
with open('2005-2007_torn.csv', 'r') as torntxt:
    lines = torntxt.readlines()

# Please add 2009 and 2008 data
# Prepare lists of latitudes and longitudes
tornadoesTuple = [line.split(',') for line in lines]
lats = [float(tuple[15]) for tuple in tornadoesTuple]
lons = [float(tuple[16]) for tuple in tornadoesTuple]

# Specify the map boundaries and projection type
map_func = Basemap(llcrnrlon= -120, llcrnrlat=23, urcrnrlon=-65, urcrnrlat=48,
                   projection='tmerc', lon_0 = -95, lat_0 = 35,
                   resolution = 'l')

# Draw some features of the map
map_func.drawcoastlines(color = 'gray')
map_func.drawcountries(color = 'gray')
map_func.drawstates(color = 'gray')
map_func.drawmapboundary()

# Plot tornadoes
x,y = map_func(lons, lats)
minx, miny = map_func(-120, 23)
maxx, maxy = map_func(-65, 48)

heatmap, xedges, yedges = np.histogram2d(y, x, [75, 60], range = [[miny, maxy], [minx, maxx]], normed=True)

# Standard rainbow heatmap
def rainbow():
    extent = [xedges[0], xedges[-1], yedges[0], yedges[-1]]
    map_func.imshow(heatmap, cmap=cm.hot, extent=extent)
    plt.colorbar(cmap = cm.hot,ticks=[], norm=norm)
    plt.show()

# Continuous heatmap
def continuous():
    cdict = {'red': ((0.0, 1.0, 1.0), (1.0, (37./255), (37./255))),
        'green': ((0.0, 1.0, 1.0), (1.0, (52./255), (52./255))),
        'blue': ((0.0, (204./255), (204./255)), (1.0, (148./255), (148./255)))}

    my_cmap = matplotlib.colors.LinearSegmentedColormap('my_colormap',cdict,256)
    map_func.imshow(heatmap, cmap=my_cmap)
    plt.colorbar(cmap = my_cmap,ticks=[], norm=norm)
    plt.show()

# Discrete heatmap
def discrete():
    cmap = mpl.colors.ListedColormap([(239./255, 243./255, 1), (189./255, 215./255, 231./255), (107./255, 174./255, 214./255), (49./255, 130./255, 189./255), (8./255, 81./255, 156./255)])

    # make a color map of fixed colors
    bounds=[0,3,6,9,12,15]
    norm = mpl.colors.BoundaryNorm(bounds, cmap.N)

    # tell imshow about color map so that only set colors are used
    map_func.imshow(heatmap,interpolation='nearest',
                        cmap = cmap)

    # make a color bar
    plt.colorbar(cmap=cmap,
                    norm=norm,boundaries=bounds,ticks=[0,3,6,9,12,15])

    plt.show()
