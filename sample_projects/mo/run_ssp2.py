import os
import sys
print("sys.argv:", sys.argv)
print("os.getcwd():", os.getcwd())
print("os.environ:", os.environ)
import matplotlib
matplotlib.use('Agg')

from fmpy.ssp.simulation import simulate_ssp
from fmpy.util import plot_result

#model_name = "HelloWorld"
#mo_file = "/var/oscli/clones/openstudio-workflow/lib/openstudio/workflow/jobs/HelloWorld.mo"
ssp_filename = sys.argv[1]
run_dir = sys.argv[2] + '/FMU'
os.mkdir(run_dir)
os.chdir(run_dir)
print("os.getcwd():", os.getcwd())
print("Simulating %s..." % ssp_filename)
result = simulate_ssp(ssp_filename, stop_time=12960000, step_size=600)

show_plot=True

if show_plot:
    dir, _ = os.path.split(run_dir)
    save_name = dir + '/ssp.png'
    print("Plotting results in directory:",save_name)
    print("run_dir:",run_dir)
    plot_result(result, names=['time', 'space.TRooMea'], window_title=ssp_filename, filename=save_name)

print('result: ', result)
print('Done.')
