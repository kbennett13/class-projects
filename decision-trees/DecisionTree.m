function DecisionTree(purity_threshold,size_threshold)
    training_data = importdata('trainX.txt');
    training_labels = importdata('trainY.txt');
    num_labels = 10;
    test_data = importdata('testX.txt');
    disp('Imported data');
    
    test_labels = classify(training_data,training_labels,test_data,...
        num_labels,size_threshold,purity_threshold);
    
    fileID = fopen('testY.txt','w');
    fprintf(fileID,'%u',test_labels);
    fclose(fileID);