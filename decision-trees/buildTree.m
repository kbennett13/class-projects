function t = buildTree(k,data,labels,num_labels,size_threshold,...
    purity_threshold)

    t = Tree;
    t.leaf = false;
    [num_points,~] = size(data);
    label_counts = zeros(1,num_labels);
    
    % count number of points in each class
    for i = 1:num_points
        label_counts(labels(i)) = label_counts(labels(i)) + 1;
    end
    
    % determine majority class
    max_index = 0;
    max = 0;
    
    for i = 1:num_labels
        if label_counts(i) > max
            max = label_counts(i);
            max_index = i;
        end
    end
    
    % make node
    if num_points > size_threshold && max/num_points < purity_threshold
        % determine split point
        [d,v] = chooseSplitPoint(k,data,labels,label_counts);
        
        t.dimension = d;
        t.split_value = v;
        
        in_index = 1;
        out_index = 1;
        
        % partition data and update included indices
        for i = 1:num_points
            %if included(i) == 1
                sample = data(i,:);
                if sample(d) <= v
                    in(in_index,:) = sample;
                    in_labels(in_index) = labels(i);
                    in_index = in_index + 1;
                else
                    out(out_index,:) = sample;
                    out_labels(out_index) = labels(i);
                    out_index = out_index + 1;
                end
            %end
        end
        
        % continue splitting
        t.leftChild = buildTree(k+1,in,in_labels,num_labels,...
            size_threshold,purity_threshold);
        t.rightChild = buildTree(k+1,out,out_labels,num_labels,...
            size_threshold,purity_threshold);
    else
        t.leaf = true;
        t.label = max_index;
    end