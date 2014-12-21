function [C,n] = spectral_clustering(data_file, cluster_file, k, s)
    data = importdata(data_file);
    %actual = importdata(cluster_file);
    [num_samples, dim] = size(data);
    disp(s);
    disp('Imported data');
    
    A = zeros(num_samples);
    % build A
    for i = 1:num_samples
        for j = 1:num_samples
            if i ~= j
                A(i,j) = exp((-find_dist(data(i,:),data(j,:)))/(2*s^2));
            end
        end
    end
    
    disp('Built A');
    
    D = zeros(num_samples);
    % build D
    for i = 1:num_samples
        sum = 0;
        for j = 1:num_samples
            sum = sum + A(i,j);
        end
        D(i,i) = sum;
    end
    
    disp('Built D');
    
    % build L
    L = (D^-0.5)*A*(D^-0.5);
    
    disp('Built L');
    
    % build X
    [vectors,values] = eig(L);
    [~,num_eigs] = size(values);
    largest_indices = zeros(20,1);
    X = zeros(num_samples,k);
    for i = 1:k
        index = 0;
        max = -1024;
        for j = 1:num_eigs
            if ~(any(largest_indices == j))
                if values(j,j) > max
                    max = values(j,j);
                    index = j;
                end
            end
        end
        largest_indices(i) = index;
        X(:,i) = vectors(:,index);
    end
    disp('Built X');
    
    % build Y
    Y = zeros(num_samples,k);
    for i = 1:num_samples
        sum = 0;
        for j = 1:k
            sum = sum + X(i,j)^2;
        end
        for j = 1:k
            Y(i,j) = X(i,j)/sqrt(sum);
        end
    end
    disp('Built Y');
    
    [min_array, max_array] = minmax(Y);
    
    [first_cluster, first_score] = k_means(Y,k, min_array, max_array);
    
    k_clustering = first_cluster;
    best_sse = first_score;
    
    % run k-means several times to get lowest sse
    for i = 1:10
        [clustering, score] = k_means(Y,k, min_array, max_array);
        if score < best_sse
            k_clustering = clustering;
            best_sse = score;
        end
    end
    disp('Ran k-means');
    
    C = zeros(num_samples,1);
    % convert k-means results
    for i = 1:k
        for j = 1:num_samples
            if k_clustering(i,j) == 1
                C(j) = i;
            end
        end
    end
    
    
    n = nmi(C, k);