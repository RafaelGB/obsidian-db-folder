import os
import yaml
import shutil
'''
read from config.yaml file the origin and target folders and copy the files inside
'''
if __name__ == '__main__':
    with open('devops/config.yaml', 'r') as stream:
        try:
            config = yaml.safe_load(stream)
            origin = config['base']['origin']
            target = config['base']['target']
            print("target path:"+target)
            avaliableFiles = config['files']
            for folder in origin:
                print("Iterating files from path:"+folder)
                for file in os.listdir(folder):
                    if file.endswith(tuple(avaliableFiles)):
                        print("Moving file: " + file)
                        shutil.copy(folder+file, target+file)
        except yaml.YAMLError as exc:
            print(exc)