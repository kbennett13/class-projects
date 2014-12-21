This project is an implementation of spectral clustering in MATLAB. The approach is as follows:

Given a set {si} of points to cluster into k groups:· Find the affinity matrix A.· Find the matrix D whose diagonal entries (i,i) are the sum of the i-th row. · Compute the matrix L = D^(−1/2)*A*D^(−1/2).· Find the k largest eigenvectors and form the matrix X from this.· Form the matrix Y by normalizing the rows of X.· Use each row of Y as a datapoint in K-means.· If row i is assigned to cluster j in K-means, assign point i to cluster j.

In the spectral clustering algorithm, I run K-means several times to get the lowest sum of squared errors. After using spectral clustering with the best K-means clustering, I find the normalized mutual information of the optimal clustering and the K-means clustering.

fea.txt - Data.

gnd.txt - Optimal clustering.

minmax.m - Finds the minimum and maximum value of each dimension.

minmax_whole.m - Finds the minimum and maximum value of the entire matrix.