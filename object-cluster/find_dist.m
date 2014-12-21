function z = find_dist(x,y)
    [~,d] = size(x);
    sum = 0;
    
    for i = 1:d
        sum = sum + (x(i) - y(i))^2;
    end
    
    z = sqrt(sum);