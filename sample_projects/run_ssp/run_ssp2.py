import os
import sys
print("sys.argv:", sys.argv)
print("os.getcwd():", os.getcwd())
print("os.environ:", os.environ)
import matplotlib
import matplotlib.pyplot as pl
matplotlib.use('Agg')

from fmpy.ssp.simulation import simulate_ssp
from fmpy.util import plot_result

#model_name = "HelloWorld"
#mo_file = "/var/oscli/clones/openstudio-workflow/lib/openstudio/workflow/jobs/HelloWorld.mo"
ssp_filename = sys.argv[1]
run_dir = sys.argv[2] + '/FMU'
fmu_start_time = int(sys.argv[3])
fmu_stop_time = int(sys.argv[4])
fmu_time_step = int(sys.argv[5])
os.mkdir(run_dir)
os.chdir(run_dir)
print("os.getcwd():", os.getcwd())
print("Simulating %s..." % ssp_filename)
result = simulate_ssp(ssp_filename, start_time=fmu_start_time, stop_time=fmu_stop_time, step_size=fmu_time_step)

show_plot=True

if show_plot:
    dir, _ = os.path.split(run_dir)
    save_name = dir + '/ssp.png'
    save_name2 = dir + '/temp.png'
    print("Plotting results in directory:",save_name)
    print("run_dir:",run_dir)
    #plot_result(result, names=['space.electric_demand', 'space.district_heating', 'space.district_cooling'], window_title=ssp_filename, filename=save_name)
    #plot_result(result, names=['space.zone_temp'], window_title=ssp_filename, filename=dir + '/temp.png')
    fig1 = pl.figure()
    ax1 = fig1.add_subplot()
    ax1.plot(result['electric.y'], 'b--')
    ax1.plot(result['space.district_heating'], 'r')
    ax1.plot(result['space.district_cooling'], 'g')
    pl.savefig(save_name)

print('result: ', result)
print('Done.')
