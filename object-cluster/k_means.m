function [C, score] = k_means(D,k,min_array,max_array)
    [num_samples, dim] = size(D);
    old_means = zeros(k,dim);
    means = zeros(k,dim);
    mins = min_array;
    maxs = max_array;
    eps = 0.00000001;
    finished = false;
    
    % pick starting means
    for i = 1:k
        for j = 1:dim
            means(i,j) = (maxs(j) - mins(j))*rand() + mins(j);
        end
    end
    
    % assign & update
    while ~finished
        finished = true;
        old_means = means;
        C = zeros(k,num_samples);
        
        % assign samples to clusters
        for i = 1:num_samples
            dist = 1024;
            dist_index = 0;
            for j = 1:k
                f = find_dist(D(i,:),means(j,:));
                
                if f < dist
                    dist = f;
                    dist_index = j;
                end
            end
            C(dist_index,i) = 1;
        end
        
        % calculate new means
        for i = 1:k
            sum = zeros(dim,1);
            number = 0;
            for j = 1:num_samples
                if C(k,j) == 1
                    for l = 1:dim
                        sum(l) = sum(l) + D(j,l);
                        number = number + 1;
                    end
                end
            end
            for l = 1:dim
                means(k,l) = sum(l)/number;
            end
        end
        
        % check for distance between old and new means
        for i = 1:k
            if find_dist(old_means(i),means(i)) > eps
                finished = false;
                break;
            end
        end
    end
    
    % find SSE
    score = sse(C, D, means);