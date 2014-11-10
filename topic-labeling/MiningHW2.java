/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package mininghw2;
import Jama.*;
import java.io.*;
import java.math.*;
import java.lang.*;
import java.util.Arrays;

/**
 *
 * @author Kathryn
 */

public class MiningHW2 {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws IOException {
        
        // constants
        int num_topics = 28;
        double c = 0.1; // changed manually after seeing results
                        // from cross-validation
        
        // read in files
        BufferedReader adj_input =
            new BufferedReader(new FileReader("W.txt"));
        BufferedReader label_input =
            new BufferedReader(new FileReader("labels.txt"));
        
        Matrix A = Matrix.read(adj_input);
                
        Matrix L = Matrix.read(label_input);
        
        // form transition matrix from adjacency matrix
        for (int i = 0; i < A.getRowDimension(); i++)
        {
            // sum the row
            double sum = 0.0;
            for (int j = 0; j < A.getColumnDimension(); j++)
            {
                sum += A.get(i, j);
            }
            // normalize the row
            for (int j = 0; j < A.getColumnDimension(); j++)
            {
                A.set(i, j, A.get(i, j)/sum);
            }
        }
        
        Matrix I = Matrix.identity(A.getRowDimension(), A.getColumnDimension());
        
        // two-fold cross-validation to find c:
        //  randomly divide each topic in half for train and test
        double[][] training = new double[2][L.getColumnDimension()];
        double[] training_check = new double[L.getColumnDimension()];
        double[][] test = new double[3][L.getColumnDimension()];
        for (int i = 0; i < 1; i++)
        {
            // check for a good split
            boolean good = false;
            int num_entries = 0;
            
            // while the split is not good
            while (!good)
            {
                good = true;
                num_entries = 0;
                training = new double[2][L.getColumnDimension()];
                test = new double[3][L.getColumnDimension()];
                
                split(L, training, test);

                // check for all labels to be present in training set
                for (int j = 0; j < L.getColumnDimension(); j++)
                {
                    training_check[j] = training[1][j];
                }

                Arrays.sort(training_check);

                for (int j = 0; j < num_topics; j++)
                {
                    good &= (Arrays.binarySearch(training_check, j+1) > -1);
                    if (!good)
                        break;
                }
            
                // check that sizes of sets are roughly equal
                for (int k = 0; k < test[0].length; k++)
                {
                    int index = (int)test[1][k];
                    if (index == -1)
                        continue;
                    num_entries++;
                }
                
                if (num_entries > 145 || num_entries < 135)
                    good = false;
                
                System.out.println(num_entries);
            }
            
            double best_c = 0.0;
            double max_accuracy = 0.0;
            
            double[][] r = new double[num_topics][A.getColumnDimension()];
            
            // form r vectors
            for (int k = 1; k <= num_topics; k++)
            {
                // find number of nodes with this label
                double labeled = 0;
                int[] marked = new int[L.getColumnDimension()];
                
                for (int m = 0; m < L.getColumnDimension(); m++)
                {
                    if (training[1][m] == k)
                    {
                        labeled++;
                        marked[m] = (int)training[0][m];
                    }
                }
                
                // add weights to r vectors
                double weight = 1./labeled;
                
                for (int m = 0; m < marked.length; m++)
                {
                    r[k - 1][marked[m]] = weight;
                }
            }
            
            Matrix print = new Matrix(r);
            Matrix train2 = new Matrix(training);
            train2.print(4, 0);
            print.print(4,0);
            
            /*for (int j = 1; j <= 5; j++)
            {
                double test_c = j/10.;
                Matrix M = I.minus(A.times(1. - test_c)).inverse();
                double[][] d = new double[num_topics][A.getColumnDimension()];
                Matrix distribution = new Matrix(d);
                            
                // predict labels 
                //  by doing uniform linear combination of nodes in topic
                for (int k = 0; k < num_topics; k++)
                {
                    // multiply for each r vector
                    double[][] b = new double[1][A.getColumnDimension()];
                    b[0] = r[k];
                    Matrix bias = new Matrix(b);
                    distribution.setMatrix(k, k, 0, A.getColumnDimension() - 1, bias.times(c).times(M));
                }
                
                for (int k = 0; k < test[2].length; k++)
                {
                    if (test[1][k] == -1)
                        continue;
                    int node = (int)test[0][k];
                    double max = 0;
                    int label = 0;
                    for (int m = 0; m < num_topics; m++)
                    {
                        if (distribution.get(m, node) >= max)
                            max = distribution.get(m, node);
                            label = m;
                    }
                    test[2][k] = label;
                }

                // check accuracy of c for split (average accuracy of directions)
                int num_correct = 0;
                for (int k = 0; k < test[0].length; k++)
                {
                    int index = (int)test[1][k];
                    if (index == -1)
                        continue;
                    if (test[2][k] == L.get(1,index))
                    {
                        num_correct++;
                    }
                }

                double accuracy = num_correct/num_entries;
                if (accuracy > max_accuracy)
                {
                    max_accuracy = accuracy;
                    best_c = test_c;
                }
            }
            
            System.out.println("Best c for split " + i + ": "
                    + best_c + "\nAccuracy: " + max_accuracy*100 + "%");*/
        }
        
        // label the rest of the nodes:
        //  c is found using cross-validation
        //  r vector for topic 1 is uniform linear combination
        //      of known nodes from 280 labels
        /*double[][] r2 = new double[num_topics][A.getColumnDimension()];
        
        double[] results = new double[A.getColumnDimension()];
        
        for (int k = 0; k < A.getColumnDimension(); k++)
        {
              results[k] = 0;
        }
        
        for (int k = 0; k < L.getColumnDimension(); k++)
        {
              results[(int)L.get(0,k) - 1] = L.get(1, k);
        }
        
        for (int k = 1; k <= num_topics; k++)
        {
            // find number of nodes with this label
            int labeled = 0;
            int[] marked = new int[A.getColumnDimension()];

            for (int m = 0; m < L.getColumnDimension(); m++)
            {
                if (L.get(1, m) == k)
                {
                    labeled++;
                    marked[m] = (int)L.get(0, m);
                }
            }

            // add weights to r vectors
            double weight = 1/labeled;

            for (int m = 0; m < marked.length; m++)
            {
                r2[k - 1][marked[m]] = weight;
            }
        }
        
        Matrix T = I.minus(A.times(1. - c)).inverse();
        double[][] d2 = new double[num_topics][A.getColumnDimension()];
        Matrix distributions = new Matrix(d2);
        
        for (int i = 0; i < num_topics; i++)
        {
            double[][] b2 = new double[1][A.getColumnDimension()];
            b2[0] = r2[i];
            Matrix biases = new Matrix(b2);
            Matrix v = biases.times(c).times(T);
            distributions.setMatrix(i, i, 0, A.getColumnDimension() - 1, v);
        }
        
        for (int k = 0; k < A.getColumnDimension(); k++)
        {
            if (results[k] != 0)
                continue;
            int node = k;
            double max = 0;
            int label = 0;
            for (int m = 0; m < num_topics; m++)
            {
                if (distributions.get(m, node) >= max)
                    max = distributions.get(m, node);
                    label = m;
            }
            results[k] = label;
        }
        
        double[][] f = new double[2][A.getColumnDimension()];
        for (int k = 0; k < A.getColumnDimension(); k++)
        {
            f[0][k] = k;
        }
        f[1] = results;
        Matrix finals = new Matrix(f);
        
        // write labels to file
        PrintWriter label_writer = new PrintWriter("predictlabels.txt");
        finals.print(label_writer, 4, 0);
        label_writer.flush();*/
    }
    
    public static double[][][] split(Matrix L, double[][] training, double[][] test) 
    {
        // split labels
        for (int j = 0; j < L.getColumnDimension(); j++)
        {
            double half = Math.random();
            if (half < 0.5)
            {
                training[0][j] = L.get(0,j);
                training[1][j] = L.get(1,j);
                test[1][j] = -1; // marked as not part of the test set, no index to check
            }
            else
            {
                test[0][j] = L.get(0,j);
                test[1][j] = j;
            }
        }
        
        double[][][] result = new double[2][][];
        result[0] = training;
        result[1] = test;
        
        return result;
    }
}
