function score = sse(C, D, M)
    [k,num_samples] = size(C);
    score = 0;
    
    for i = 1:k
        for j = 1:num_samples
            if C(i,j) == 1
                score = score + find_dist(M(i,:), D(j,:));
            end
        end
    end