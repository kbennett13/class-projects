function [min,max] = minmax_whole(M)
    [row, col] = size(M);
    min = 1;
    max = 0;
    
    for i = 1:row
        for j = (i+1):col
            if M(i,j) > max
                max = M(i,j);
            end
            
            if M(i,j) < min
                min = M(i,j);
            end
        end
    end