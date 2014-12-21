function labels = classify(training,training_labels,test,num_labels,...
    size_threshold,purity_threshold)

    [num_unknown,~] = size(test);

    labels = zeros(1,num_unknown);
    
    % build tree from known
    t = buildTree(0,training,training_labels,num_labels,size_threshold,...
        purity_threshold);
    
    % categorize unknown
    for i = 1:num_unknown
       labels(i) = categorize(test(i,:),t); 
    end