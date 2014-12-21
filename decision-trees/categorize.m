function l = categorize(point,t)
    if t.leaf
        l = t.label;
    else
        if point(t.dimension) <= t.split_value
            l = categorize(point,t.leftChild);
        else
            l = categorize(point,t.rightChild);
        end
    end