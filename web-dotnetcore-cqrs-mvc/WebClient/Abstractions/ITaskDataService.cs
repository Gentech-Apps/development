﻿using Domain.Queries;
using Domain.ViewModel;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebClient.Shared.Models;

namespace WebClient.Abstractions
{
    /// <summary>
    /// This Service is currently using the TaskModel Class, and will need to use a shared view
    /// model after the model has been created.  For the moment, this pattern facilitates a client
    /// side storage mechanism to view functionality.  See work completed for the MemberDataService
    /// for an example of expectations.
    /// </summary>
    public interface ITaskDataService
    {
        List<TaskVm> Tasks { get; }
        TaskVm SelectedTask { get; }

        event EventHandler TasksUpdated;
        event EventHandler TaskSelected;

        void SelectTask(Guid id);
        Task ToggleTask(Guid id);
        void AddTask(TaskVm model);
        Task<GetAllTasksByMemberQueryResult> GetAllTaskByMember(MemberVm memberVm);
        Task<GetAllTasksQueryResult> GetAllTask();
        Task AssignTaskToMember(Guid memberId);

    }
}