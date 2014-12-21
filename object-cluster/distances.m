function R = distances(D)
    [num_samples, dim] = size(D);
    R = zeros(num_samples);
    
    for i = 1:num_samples
        for j = 1:num_samples
            if i < j
                R(i,j) = find_dist(D(i,:),D(j,:));
            end
        end
    end